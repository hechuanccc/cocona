const pattern = {
  username: /^[a-zA-Z0-9]{4,10}$/,
  password: /^[a-zA-Z]{2}[a-zA-Z0-9]{4,13}$/
}

export function validateUserName (value) {
  return pattern.username.test(value)
}

export function validatePassword (value) {
  return pattern.password.test(value)
}
