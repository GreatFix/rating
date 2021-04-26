import React from 'react'
import ReactDOM from 'react-dom'
import bridge from '@vkontakte/vk-bridge'
import App from './App'
import { StoreContext, Store } from './store/store'
// Init VK  Mini App
const store = new Store()
bridge.send('VKWebAppInit').then((res) => store.User.setInit(res.result))

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
  document.getElementById('root')
)
if (process.env.NODE_ENV === 'development') {
  import('./eruda').then(({ default: eruda }) => {}) //runtime download
}
