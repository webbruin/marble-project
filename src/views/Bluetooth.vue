<template>
  <main class="bluetooth">
    <Header title="蓝牙连接"></Header>
    <div class="body">
      <div class="item">
        <Button buttonText="打开&连接蓝牙设备" :disabled="false" @click="connectAndListen"></Button>
      </div>
      <div class="item">
        <Button buttonText="断开蓝牙设备" :disabled="false" @click="disconnectBluetooth"></Button>
      </div>
      <div class="item" v-if="characteristic">
        <Input v-model="write" type="text" placeholder="请输入文本" @input="writeCharacteristicValue"></Input>
      </div>
      <div class="log">
        <p v-for="(item, index) in logs" :key="index">
          {{ item }}
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'
import Input from '@/components/FormData/Input.vue'
import Button from '@/components/FormData/Button.vue'

const BATTERY_SERVICE_UUID = '0000FFE0-0000-1000-8000-00805F9B34FB'.toLocaleLowerCase() // 电池服务UUID
const BATTERY_CHARACTERISTIC_UUID = '0000FFE1-0000-1000-8000-00805F9B34FB'.toLocaleLowerCase() // 电量特征UUID

// 指令


const write = ref('')  // 蓝牙实例
const bluetoothDevice = ref(null)  // 蓝牙实例
const gattServer = ref(null)
const autoSubscribeDone = ref(false)  // 标记是否已自动订阅过
const characteristic = ref(null)
const activeNotifyMap = new Map()  // key: characteristic.uuid, value: { characteristic, handler, isNotifying }
const logs = ref([])

onMounted(() => {

})

onUnmounted(() => {

})

const parseOptionalServices = () => {
  let raw = BATTERY_SERVICE_UUID.trim()
  if (raw === '') return []
  return [...new Set(raw.split(',').map(s => s.trim()).filter(s => s !== ""))]
}

// 连接主流程
const connectAndListen = async () => {
  if (bluetoothDevice.value && bluetoothDevice.value.gatt.connected) {
    addLog('设备已连接，如需更换请先断开')
    return
  }
  await disconnectBluetooth()
  const optionalServices = parseOptionalServices()
  addLog(`请求服务: ${optionalServices.join(', ')}`)
  try {
    const device = await navigator.bluetooth.requestDevice({
      // acceptAllDevices: true,
      // optionalServices: optionalServices,
      acceptAllDevices: false,
      filters: [
        { namePrefix: 'JDY-' }
      ]
    })
    bluetoothDevice.value = device
    addLog(`已选择: ${device.name || '无名称'} (${device.id})`)
    gattServer.value = await device.gatt.connect()
    addLog(`GATT 连接成功`)
    device.ongattserverdisconnected = () => {
      addLog(`设备意外断开`)
      stopAllNotifications().catch(e => { })
      gattServer.value = null;
      clearLog();
      bluetoothDevice.value = null;
      autoSubscribeDone.value = false;
    }
    // 加载服务和自动订阅通知
    await renderServicesAndCharacteristics()
    autoSubscribeDone.value = true
    addLog('🎧 监听已启动，等待蓝牙设备发送数据...')
  } catch (err) {
    addLog(`连接失败: ${err.message}`)
    if (bluetoothDevice.value) {
      await disconnectBluetooth()
    }
  }
}

// 断开连接
const disconnectBluetooth = async () => {
  if (bluetoothDevice.value && bluetoothDevice.value.gatt.connected) {
    try {
      await stopAllNotifications()
      await bluetoothDevice.value.gatt.disconnect()
      addLog(`已断开设备: ${bluetoothDevice.value.name || bluetoothDevice.value.id}`)
    } catch (err) {
      addLog(`断开异常: ${err.message}`)
    }
  }
  if (bluetoothDevice.value) {
    bluetoothDevice.value.ongattserverdisconnected = null
  }
  bluetoothDevice.value = null
  gattServer.value = null
  characteristic.value = null
  autoSubscribeDone.value = false
  clearLog()
}

const addLog = (text = '') => {
  logs.value = [text, ...logs.value]
}

const clearLog = () => {
  logs.value = []
}

// 停止所有通知并清理
const stopAllNotifications = async () => {
  for (let [uuid, item] of activeNotifyMap.entries()) {
    if (item.isNotifying && item.characteristic) {
      try {
        await item.characteristic.stopNotifications()
        if (item.handler) {
          item.characteristic.removeEventListener('characteristicvaluechanged', item.handler)
        }
        addLog(`🔕 停止通知: ${uuid}`)
      } catch (e) {
        addLog(`停止通知失败 ${uuid}: ${e.message}`)
      }
    }
  }
  activeNotifyMap.clear();
}

// 渲染服务和特征，并自动订阅所有可通知特征
const renderServicesAndCharacteristics = async () => {
  if (!gattServer.value || !gattServer.value.connected) {
    clearLog()
    return
  }
  const requestedServices = parseOptionalServices()
  let services = []
  for (let serviceUuid of requestedServices) {
    try {
      const service = await gattServer.value.getPrimaryService(serviceUuid)
      services.push(service)
      addLog(`获取服务: ${service.uuid}`)
    } catch (err) {
      addLog(`服务 ${serviceUuid} 不可用: ${err.message}`)
    }
  }
  for (const service of services) {
    try {
      const characteristics = await service.getCharacteristics()
      characteristic.value = characteristics[0]
      if (!characteristic.value) {
        addLog('无特征')
        continue
      }
      if (characteristic.value.properties.notify || characteristic.value.properties.indicate) {
        await subscribeToCharacteristic(characteristic.value)
      }
      // 如果可读，自动读取一次初始值
      if (characteristic.value.properties.read) {
        setTimeout(() => {
          if (gattServer.value?.connected) readCharacteristicValue().catch(e => { })
        }, 300)
      }
    } catch (err) {
      addLog(`获取特征失败: ${err.message}`)
    }
  }
}

// 订阅特征通知（并同时将收到的数据推送到监听窗口）
const subscribeToCharacteristic = async (characteristic) => {
  if (activeNotifyMap.has(characteristic.uuid) && activeNotifyMap.get(characteristic.uuid).isNotifying) {
    return true // 已订阅
  }
  if (!(characteristic.properties.notify || characteristic.properties.indicate)) {
    return false
  }
  try {
    // 创建处理器，同时更新特征行显示以及监听窗口
    const handler = async (event) => {
      const value = event.target.value
      const formatted = formatValue(value)
      addLog(`[监听] ${characteristic.uuid} -> ${formatted}`)
    }
    await characteristic.startNotifications()
    characteristic.addEventListener('characteristicvaluechanged', handler)
    activeNotifyMap.set(characteristic.uuid, {
      characteristic: characteristic,
      handler: handler,
      isNotifying: true
    })
  } catch (err) {
    addLog(`订阅失败 ${characteristic.uuid}: ${err.message}`)
    return false
  }
}

// 读取特征值 (用于UI上的读按钮)
const readCharacteristicValue = async () => {
  if (!characteristic.value || !gattServer.value?.connected) {
    addLog('设备未连接，无法读取')
    return
  }
  try {
    const value = await characteristic.value.readValue()
    const formatted = formatValue(value)
    addLog(`读取 ${characteristic.value.uuid} 成功: ${formatted}`)
  } catch (err) {
    addLog(`读取失败 ${characteristic.value.uuid}: ${err.message}`)
  }
}

// 格式化显示值 (ArrayBuffer -> hex + utf8)
const formatValue = (data) => {
  const { buffer } = data
  const bytes = new Uint8Array(buffer)
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ').toUpperCase()
  let utf8Str = ''
  try {
    utf8Str = new TextDecoder('utf-8').decode(buffer)
    utf8Str = utf8Str.replace(/[^\x20-\x7E\u4e00-\u9fa5]/g, '�')
  } catch (e) {
    utf8Str = '(无法解析文本)'
  }
  if (utf8Str.length > 80) utf8Str = utf8Str.substring(0, 80) + '…'
  return `Hex: ${hex || '(空)'}  |  Text: ${utf8Str || '(空)'}`
}

// 16进制转buffer
const hexStringToArrayBuffer = (hexString) => {
  const cleanHex = hexString.replace(/\s/g, '')

  // 检查长度是否为偶数，一个字节由两个十六进制字符组成
  if (cleanHex.length % 2 !== 0) {
    throw new Error('无效的十六进制字符串（长度不为偶数）')
  }

  const bytes = new Uint8Array(cleanHex.length / 2)
  for (let i = 0; i < cleanHex.length; i += 2) {
    // 将每两个字符解析为一个字节（0x00 - 0xFF）
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16)
  }
  return bytes.buffer
}

// 写入特征
const writeCharacteristicValue = async () => {
  if (!characteristic.value || !gattServer.value?.connected) {
    addLog('设备未连接，无法写入')
    return
  }
  const canWrite = characteristic.value.properties.write || characteristic.value.properties.writeWithoutResponse
  if (!canWrite) {
    addLog(`特征 ${characteristic.value.uuid} 不支持写入`)
    return
  }
  if (!write.value) {
    addLog('请输入要写入的数据')
    return
  }
  try {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(write.value)
    await characteristic.value.writeValue(hexStringToArrayBuffer(write.value))
    addLog(`✅ 写入成功: "${write.value}" (${dataBuffer.byteLength} 字节)`)
  } catch (err) {
    addLog(`写入失败: ${err.message}`)
  }
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.bluetooth {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: .vw(18)[];
    display: flex;
    overflow-x: hidden;
    overflow-y: auto;

    .item {
      margin-bottom: .vw(20)[];
    }

    .log {
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;

      p {
        color: var(--text--);
        font-family: "PingFang SC";
        font-size: .vw(14)[];
        line-height: .vw(14)[];
        font-weight: 400;
        font-style: normal;

        &:not(:last-of-type) {
          margin-bottom: .vw(10)[];
        }
      }
    }
  }
}
</style>