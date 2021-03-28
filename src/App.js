import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Epic, Tabbar, TabbarItem } from '@vkontakte/vkui';
import { AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { Icon20Search, Icon24Chats, Icon24UserOutline } from '@vkontakte/icons';

import Find from './views/find/Find';
import Reviews from './views/reviews/Reviews';
import Profile from './views/profile/Profile';
import User from './store/user';
import { observer } from 'mobx-react-lite';

import './App.css';

const FIND = 'FIND';
const PROFILE = 'PROFILE';
const REVIEWS = 'REVIEWS';

const App = observer(() => {
  const [activeStory, setActiveStory] = useState(FIND);

  if (!User.id) {
    User.getUserInfo();
  }

  if (!User.token) {
    User.getToken();
  }

  useEffect(() => {
    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === 'VKWebAppUpdateConfig') {
        const schemeAttribute = document.createAttribute('scheme');
        schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
        document.body.attributes.setNamedItem(schemeAttribute);
      }
    });
  }, []);

  return (
    <AdaptivityProvider>
      <AppRoot>
        <Epic
          activeStory={activeStory}
          tabbar={
            <Tabbar>
              <TabbarItem
                onClick={() => {
                  setActiveStory(FIND);
                }}
                selected={activeStory === FIND}
                data-story={FIND}
                text="Найти"
              >
                <Icon20Search />
              </TabbarItem>
              <TabbarItem
                onClick={() => {
                  setActiveStory(REVIEWS);
                }}
                selected={activeStory === REVIEWS}
                data-story={REVIEWS}
                text="Отзывы"
              >
                <Icon24Chats />
              </TabbarItem>
              <TabbarItem
                onClick={() => {
                  setActiveStory(PROFILE);
                }}
                selected={activeStory === PROFILE}
                data-story={PROFILE}
                label="12"
                text="Профиль"
              >
                <Icon24UserOutline />
              </TabbarItem>
            </Tabbar>
          }
        >
          <Find id={FIND} />
          <Reviews id={REVIEWS} activePanel={REVIEWS} />
          <Profile id={PROFILE} activePanel={PROFILE} />
        </Epic>
      </AppRoot>
    </AdaptivityProvider>
  );
});

export default App;
