// 工具函数

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

export {
  passwordRegExp,
  maskPhoneNumber
}