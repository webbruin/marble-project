<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="visible" class="area-picker-mask" @click.self="handleClose">
                <Transition name="slide-up">
                    <div v-if="visible" class="area-picker-container">
                        <div class="area-picker-header">
                            <button class="cancel-btn" @click="handleClose">取消</button>
                            <span class="title">选择地区</span>
                            <button class="confirm-btn" @click="handleConfirm">确定</button>
                        </div>
                        <div v-if="loading" class="loading-wrapper">
                            <div class="loading-spinner"></div>
                            <span>加载中...</span>
                        </div>
                        <div v-else class="picker-wrapper">
                            <!-- 省选择器 -->
                            <PickerColumn ref="provinceColumn" :items="provinceNames"
                                :default-index="defaultProvinceIndex" item-height="44" @select="onProvinceSelect" />
                            <!-- 市选择器 -->
                            <PickerColumn ref="cityColumn" :items="currentCityNames" :default-index="defaultCityIndex"
                                item-height="44" @select="onCitySelect" />
                            <!-- 区选择器 -->
                            <PickerColumn ref="districtColumn" :items="currentDistrictNames"
                                :default-index="defaultDistrictIndex" item-height="44" @select="onDistrictSelect" />
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import PickerColumn from './PickerColumn.vue'
import areaDataJSON from '@/utils/area-data'

const props = defineProps({
    visible: Boolean,
    modelValue: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:visible', 'update:modelValue', 'change'])

// 数据状态
const loading = ref(false)
const areaData = ref([]) // 完整省市区数据 [{ code, name, cities: [...] }]

// 子组件引用
const provinceColumn = ref(null)
const cityColumn = ref(null)
const districtColumn = ref(null)

// 当前选中的省、市、区代码或名称
const selectedProvinceCode = ref('')
const selectedCityCode = ref('')
const selectedDistrictCode = ref('')

// ---------- 数据获取与格式化 ----------
// 接口返回数据结构（根据实际返回调整，此处为常见民政部接口格式）
// 示例：[
//   { code: "110000", name: "北京市", level: 1, children: [...] },
//   ...
// ]
// 我们将它转换为组件所需的嵌套结构
const fetchAreaData = async () => {
    loading.value = true
    try {
        // 适配不同接口返回格式
        // 如果返回的是树形结构（含 children），直接转换
        // 如果返回的是扁平列表（含 parentCode），则需要构建树
        let treeData = []
        if (Array.isArray(areaDataJSON)) {
            // 判断是否有 children 字段
            if (areaDataJSON.length && areaDataJSON[0].children) {
                treeData = areaDataJSON
            } else {
                // 扁平结构 -> 构建树
                treeData = buildTreeFromFlat(areaDataJSON)
            }
        } else if (areaDataJSON.data && Array.isArray(areaDataJSON.data)) {
            // 数据包裹在 data 字段中
            treeData = areaDataJSON.data
            if (treeData.length && !treeData[0].children) {
                treeData = buildTreeFromFlat(treeData)
            }
        } else {
            throw new Error('未知的数据格式')
        }

        // 转换为组件所需格式
        areaData.value = transformToComponentFormat(treeData)
    } catch (error) {
        console.error('获取省市区数据失败:', error)
    } finally {
        loading.value = false
    }
}

// 扁平数据建树（parentCode 为 0 或 null 表示根节点）
const buildTreeFromFlat = (list, parentCode = '0') => {
    const map = new Map()
    const roots = []

    list.forEach(item => {
        map.set(item.code, { ...item, children: [] })
    })

    list.forEach(item => {
        const node = map.get(item.code)
        const parentId = item.parentCode || item.parentId || '0'
        if (parentId === parentCode) {
            roots.push(node)
        } else {
            const parent = map.get(parentId)
            if (parent) parent.children.push(node)
        }
    })

    return roots
}

// 将树形数据（省-市-区）转换为组件格式
const transformToComponentFormat = (provinces) => {
    return provinces.map(prov => {
        const cities = (prov.children || []).map(city => {
            const districts = (city.children || []).map(district => ({
                code: district.code,
                name: district.name
            }))
            // 如果该城市没有区（例如直辖市、省直辖县级市），添加一个虚拟区
            if (districts.length === 0) {
                districts.push({ code: city.code, name: city.name })
            }
            return {
                code: city.code,
                name: city.name,
                districts
            }
        })
        // 如果省份没有城市（理论上不应发生），添加虚拟城市
        if (cities.length === 0) {
            cities.push({
                code: prov.code,
                name: prov.name,
                districts: [{ code: prov.code, name: prov.name }]
            })
        }
        return {
            code: prov.code,
            name: prov.name,
            cities
        }
    })
}

// ---------- 辅助计算属性 ----------
const provinceNames = computed(() => areaData.value.map(p => p.name))
const currentProvince = computed(() => {
    return areaData.value.find(p => p.code === selectedProvinceCode.value) || areaData.value[0]
})
const currentCityNames = computed(() => {
    return currentProvince.value?.cities.map(c => c.name) || []
})
const currentCity = computed(() => {
    const cities = currentProvince.value?.cities || []
    return cities.find(c => c.code === selectedCityCode.value) || cities[0]
})
const currentDistrictNames = computed(() => {
    return currentCity.value?.districts.map(d => d.name) || []
})

// 默认索引（用于首次渲染）
const defaultProvinceIndex = computed(() => {
    const idx = provinceNames.value.findIndex(name => name === currentProvince.value?.name)
    return idx >= 0 ? idx : 0
})
const defaultCityIndex = computed(() => {
    const idx = currentCityNames.value.findIndex(name => name === currentCity.value?.name)
    return idx >= 0 ? idx : 0
})
const defaultDistrictIndex = computed(() => {
    const idx = currentDistrictNames.value.findIndex(name => name === (currentCity.value?.districts.find(d => d.code === selectedDistrictCode.value)?.name))
    return idx >= 0 ? idx : 0
})

// 根据传入的字符串 "省/市/区" 解析代码（等待数据加载完成后调用）
const parseInitialValue = async (val) => {
    if (!val || areaData.value.length === 0) return null
    const parts = val.split(' ')
    if (parts.length !== 3) return null
    const [provinceName, cityName, districtName] = parts
    const province = areaData.value.find(p => p.name === provinceName)
    if (!province) return null
    const city = province.cities.find(c => c.name === cityName)
    if (!city) return null
    const district = city.districts.find(d => d.name === districtName)
    if (!district) return null
    return {
        provinceCode: province.code,
        cityCode: city.code,
        districtCode: district.code
    }
}

// 同步三个滚动列的位置（在数据加载或选中变化后调用）
const syncColumnsPosition = async () => {
    await nextTick()
    if (!provinceColumn.value || !cityColumn.value || !districtColumn.value) return
    const provIndex = provinceNames.value.findIndex(name => name === currentProvince.value?.name)
    if (provIndex >= 0) provinceColumn.value.setSelectedIndex(provIndex, false)
    const cityIndex = currentCityNames.value.findIndex(name => name === currentCity.value?.name)
    if (cityIndex >= 0) cityColumn.value.setSelectedIndex(cityIndex, false)
    const districtIndex = currentDistrictNames.value.findIndex(name => name === (currentCity.value?.districts.find(d => d.code === selectedDistrictCode.value)?.name))
    if (districtIndex >= 0) districtColumn.value.setSelectedIndex(districtIndex, false)
}

// ---------- 事件处理 ----------
const onProvinceSelect = (index, provinceName) => {
    const province = areaData.value.find(p => p.name === provinceName)
    if (province) {
        selectedProvinceCode.value = province.code
        const firstCity = province.cities[0]
        if (firstCity) {
            selectedCityCode.value = firstCity.code
            const firstDistrict = firstCity.districts[0]
            selectedDistrictCode.value = firstDistrict?.code || ''
        } else {
            selectedCityCode.value = ''
            selectedDistrictCode.value = ''
        }
        syncColumnsPosition()
    }
}

const onCitySelect = (index, cityName) => {
    const city = currentProvince.value?.cities.find(c => c.name === cityName)
    if (city) {
        selectedCityCode.value = city.code
        const firstDistrict = city.districts[0]
        selectedDistrictCode.value = firstDistrict?.code || ''
        syncColumnsPosition()
    }
}

const onDistrictSelect = (index, districtName) => {
    const district = currentCity.value?.districts.find(d => d.name === districtName)
    if (district) {
        selectedDistrictCode.value = district.code
    }
}

const handleConfirm = () => {
    const provinceName = currentProvince.value?.name || ''
    const cityName = currentCity.value?.name || ''
    const districtName = currentCity.value?.districts.find(d => d.code === selectedDistrictCode.value)?.name || ''
    const fullPath = `${provinceName} ${cityName} ${districtName}`
    emit('update:modelValue', fullPath)
    emit('change', fullPath, {
        province: provinceName,
        city: cityName,
        district: districtName
    })
    handleClose()
}

const handleClose = () => {
    emit('update:visible', false)
}

// ---------- 生命周期与监听 ----------
// 当弹窗打开时，确保数据已加载，并根据 modelValue 初始化选中项
watch(() => props.visible, async (newVal) => {
    if (newVal) {
        if (areaData.value.length === 0) {
            await fetchAreaData()
        }
        // 解析初始值
        const init = await parseInitialValue(props.modelValue)
        if (init) {
            selectedProvinceCode.value = init.provinceCode
            selectedCityCode.value = init.cityCode
            selectedDistrictCode.value = init.districtCode
        } else if (areaData.value.length) {
            // 默认选中第一个省市区
            const firstProvince = areaData.value[0]
            selectedProvinceCode.value = firstProvince.code
            const firstCity = firstProvince.cities[0]
            selectedCityCode.value = firstCity.code
            const firstDistrict = firstCity.districts[0]
            selectedDistrictCode.value = firstDistrict?.code || ''
        }
        await syncColumnsPosition()
    }
})

// 监听 modelValue 外部变化（仅在弹窗关闭时同步内部状态，避免冲突）
watch(() => props.modelValue, async (newVal) => {
    if (!props.visible && areaData.value.length) {
        const init = await parseInitialValue(newVal)
        if (init) {
            selectedProvinceCode.value = init.provinceCode
            selectedCityCode.value = init.cityCode
            selectedDistrictCode.value = init.districtCode
        }
    }
})

// 组件挂载时预加载数据（可选，提升体验）
onMounted(() => {
    if (areaData.value.length === 0) {
        fetchAreaData()
    }
})
</script>

<style scoped>
.area-picker-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

.area-picker-container {
    width: 100%;
    background-color: #fff;
    border-radius: 16px 16px 0 0;
    display: flex;
    flex-direction: column;
    max-height: 70vh;
}

.area-picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e5e5e5;
    background-color: #fff;
    border-radius: 16px 16px 0 0;
}

.cancel-btn,
.confirm-btn {
    font-size: 16px;
    background: none;
    border: none;
    padding: 8px 0;
    cursor: pointer;
    color: var(--orange--);
    font-weight: 500;
}

.cancel-btn {
    color: #666;
}

.title {
    font-size: 18px;
    font-weight: 500;
    color: #333;
}

.picker-wrapper {
    display: flex;
    justify-content: space-between;
    background: #fff;
    height: 260px;
    overflow: hidden;
}

.loading-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 260px;
    color: #999;
    font-size: 14px;
}

.loading-spinner {
    width: 30px;
    height: 30px;
    border: 2px solid #e5e5e5;
    border-top-color: var(--orange--);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 12px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
}

@media (max-width: 768px) {
    .picker-wrapper {
        height: 240px;
    }
}
</style>