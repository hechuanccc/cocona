const pattern = {
  username: /^[a-zA-Z0-9]{4,10}$/,
  password: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/,
  qq: /^[1-9]{4,8}$/
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
