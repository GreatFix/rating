import React, { useState, useEffect, useCallback } from 'react'
import { AdaptivityProvider, AppRoot, Epic, Tabbar, TabbarItem, ConfigProvider } from '@vkontakte/vkui'
import { Icon20Search, Icon24Chats, Icon24UserOutline } from '@vkontakte/icons'
import '@vkontakte/vkui/dist/vkui.css'
import Find from './views/Find'
import Interesting from './views/Interesting'
import Profile from './views/Profile'
import bridge from '@vkontakte/vk-bridge'
import { observer } from 'mobx-react-lite'
import './App.css'

const FIND = 'FIND'
const INTERESTING = 'INTERESTING'
const PROFILE = 'PROFILE'

const App = observer(() => {
  const [activeStory, setActiveStory] = useState(PROFILE)

  useEffect(() => {
    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === 'VKWebAppUpdateConfig') {
        const schemeAttribute = document.createAttribute('scheme')
        schemeAttribute.value = data.scheme ? data.scheme : 'client_light'
        document.body.attributes.setNamedItem(schemeAttribute)
      }
    })
  }, [])

  const setStoryFind = useCallback(() => {
    setActiveStory(FIND)
  }, [])
  const setStoryInteresting = useCallback(() => {
    setActiveStory(INTERESTING)
  }, [])
  const setStoryProfile = useCallback(() => {
    setActiveStory(PROFILE)
  }, [])
  return (
    <AdaptivityProvider>
      <ConfigProvider isWebView={true}>
        <AppRoot>
          <Epic
            activeStory={activeStory}
            tabbar={
              <Tabbar>
                <TabbarItem onClick={setStoryFind} selected={activeStory === FIND} text="Найти">
                  <Icon20Search />
                </TabbarItem>
                <TabbarItem onClick={setStoryInteresting} selected={activeStory === INTERESTING} text="Интересное">
                  <Icon24Chats />
                </TabbarItem>
                <TabbarItem onClick={setStoryProfile} selected={activeStory === PROFILE} text="Профиль">
                  <Icon24UserOutline />
                </TabbarItem>
              </Tabbar>
            }
          >
            <Find id={FIND} />
            <Interesting id={INTERESTING} />
            <Profile id={PROFILE} />
          </Epic>
        </AppRoot>
      </ConfigProvider>
    </AdaptivityProvider>
  )
})

export default App
