/**
 * 工具函数库
 */

// 密码校验
const passwordRegExp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,20}$/)

// 手机号中间四位机密
const maskPhoneNumber = (phone) => {
  // 参数校验：必须为字符串或可转为字符串的类型
  if (phone == null) return phone;
  const str = String(phone);
  
  // 仅当长度为11时执行脱敏，否则返回原字符串（可根据需求调整）
  if (str.length === 11) {
    return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
  // 通用处理：如果长度足够，将第4-7位替换为****
  if (str.length >= 7) {
    return str.substring(0, 3) + '****' + str.substring(7);
  }
  // 长度不足7位，无法脱敏，返回原值
  return str;
}

/**
 * 给数字添加千位分隔符（逗号）
 * @param {number|string} input - 待格式化的数字或数字字符串
 * @param {string} [separator=','] - 千位分隔符，默认为逗号
 * @returns {string} 格式化后的字符串，若输入无效则返回原始输入
 */
function formatNumberWithCommas(input, separator = ',') {
  // 处理 null/undefined/空字符串
  if (input === null || input === undefined || input === '') {
    return ''
  }

  // 转换为字符串并去除首尾空格
  let str = String(input).trim()
  if (str === '') return ''

  // 提取数字部分和符号（负号）
  const match = str.match(/^(-?)(\d+)(?:\.(\d+))?$/)
  if (!match) {
    // 不是有效的数字格式，返回原字符串
    return str
  }

  const sign = match[1]        // 负号或空
  let integerPart = match[2]   // 整数部分
  const decimalPart = match[3] // 小数部分（可能 undefined）

  // 整数部分添加千位分隔符
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator)

  // 组合结果
  let result = sign + integerPart
  if (decimalPart !== undefined) {
    result += '.' + decimalPart
  }
  return result
}

/**
 * 将数字格式化为小数点后两位（自动补零，四舍五入）
 * @param {number|string} input - 待格式化的数字或数字字符串
 * @returns {string} 格式化后的字符串，如 "5.00", "3.10", "7.23"
 */
function formatToTwoDecimals(input) {
  // 处理 null/undefined/空字符串
  if (input === null || input === undefined || input === '') {
    return ''
  }

  // 转换为数字
  const num = Number(input)
  
  // 无效数字判断
  if (isNaN(num)) {
    return String(input)
  }

  // 保留两位小数并补零
  return num.toFixed(2)
}

export {
  passwordRegExp,
  maskPhoneNumber,
  formatNumberWithCommas,
  formatToTwoDecimals
}