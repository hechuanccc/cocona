import store from '../store'
import urls from '../api/urls'
// import store from '../store'

function GhostSocketObj (token) {
  this.ws = new WebSocket(`${urls.wsGhostHost}/ws?token=${token}`)

  this.ws.onclose = (e) => {
    store.dispatch('setWs', null)
  }

  this.ws.onerror = (e) => {
    store.dispatch('setWs', null)
  }

  this.ws.onmessage = (response) => {
    let data
    if (typeof response.data === 'string') {
      try {
        data = JSON.parse(response.data)

        switch (data.type) {
          case 'win-notification':
            store.dispatch('updateWinNotification', data)
            break
        }
      } catch (e) {
        console.log(e, 'error')
      }
    }
  }
}

export default GhostSocketObj
