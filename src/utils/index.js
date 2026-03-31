// 工具函数

// 密码校验
const passwordRegExp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,20}$/)

export {
  passwordRegExp
}