export default {
  methods: {
    errorHandler (errors) {
      let message
      if (Array.isArray(errors)) {
        let messages = []

        errors.forEach(error => {
          Object.keys(error).forEach(key => {
            messages.push(error[key])
          })
        })
        message = messages.join(', ')
      } else {
        message = errors
      }

      this.$message({
        showClose: true,
        message: message,
        type: 'error'
      })
    }
  }
}
