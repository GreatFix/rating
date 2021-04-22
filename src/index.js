import React from 'react'
import ReactDOM from 'react-dom'
import bridge from '@vkontakte/vk-bridge'
import App from './App'
import { StoreContext, Store } from './store/store'
// Init VK  Mini App
bridge.send('VKWebAppInit')

ReactDOM.render(
  <StoreContext.Provider value={new Store()}>
    <App />
  </StoreContext.Provider>,
  document.getElementById('root')
)
if (process.env.NODE_ENV === 'development') {
  import('./eruda').then(({ default: eruda }) => {}) //runtime download
}
