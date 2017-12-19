const pattern = {
  username: /^[a-zA-Z0-9]{6,15}$/,
  password: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/,
  qq: /^[1-9]{4,8}$/,
  phone: /^1[0-9]{10}$/,
  bankAccount: /^[0-9]{10,}$/,
  withdrawPassword: /^[0-9]{6}$/
}

export function validateUserName (value) {
  return pattern.username.test(value)
}

export function validatePassword (value) {
  return pattern.password.test(value)
}

export function validateQQ (value) {
  return pattern.qq.test(value)
}

export function validatePhone (value) {
  return pattern.phone.test(value)
}

export function validateBankAccount (value) {
  return pattern.bankAccount.test(value)
}

export function validateWithdrawPassword (value) {
  return pattern.withdrawPassword.test(value)
}
