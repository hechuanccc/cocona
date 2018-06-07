module.exports = {
  // url: function () {
  //   return this.api.launchUrl + 'game/172/1884'
  // },
  commands: [{
    selectAll: function () {
      this.api.elements('css selector', '.clickable', (elems) => {
        elems.value.forEach(ele => {
          this.api.elementIdClick(ele.ELEMENT)
        })
      })
    }
  }],
  elements: {
    amountInput: {
      selector: 'div.bet-area > div.actions input.el-input__inner'
    },
    betButton: {
      selector: 'div.bet-area > div.actions button.place-order-btn'
    },
    confirmButton: {
      selector: 'div.game-container div.el-dialog__wrapper div.el-dialog__body button.el-button.el-button--primary.el-button--medium'
    },
    dialog: {
      selector: 'div.game-container div.el-dialog__wrapper'
    },
    alertSuccess: {
      selector: 'div.game-container div.el-dialog__wrapper div.el-dialog__body div.el-alert.el-alert--success.is-center'
    }
  }
}
