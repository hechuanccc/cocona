'use strict'

export default {
  register: {
    username: 'User Name',
    password: 'Password',
    confirm_password: 'Confirm Password',
    realname: 'Real Name',
    phone: 'Phone Number',
    email: 'Email',
    withdraw_password: 'Withdraw Password',
    captcha: 'Captcha'
  },
  action: {
    submit: 'Submit',
    reset: 'Reset'
  },
  validate: {
    username_validate: 'User name length should be 4-10 digit or character',
    password_validate: 'Password length should be 6-15 digit or character,  the first two letters must be charater',
    password_again: 'Please enter password again',
    password_diff: 'twice password are different',
    username_exist: 'This usernam has existed',
    username_required: 'User name is required',
    password_required: 'Password is required',
    realname_required: 'Real name is required',
    phone_required: 'Phone Number is required',
    email_required: 'Email address is required',
    email_validate: 'This email is invalid',
    withdraw_password_required: 'Withdraw password is required',
    captcha_required: 'Captch is required'
  }
}
