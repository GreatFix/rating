import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Epic, Tabbar, TabbarItem } from '@vkontakte/vkui';
import { AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { Icon20Search, Icon24Chats, Icon24UserOutline } from '@vkontakte/icons';

import Find from './views/find//Find';
import Reviews from './views/reviews/Reviews';
import Profile from './views/profile/Profile';
import User from './store/user';
import { observer } from 'mobx-react-lite';

const App = observer(() => {
  const [activeStory, setActiveStory] = useState('find');

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
                  setActiveStory('find');
                }}
                selected={activeStory === 'find'}
                data-story="find"
                text="Найти"
              >
                <Icon20Search />
              </TabbarItem>
              <TabbarItem
                onClick={() => {
                  setActiveStory('reviews');
                }}
                selected={activeStory === 'reviews'}
                data-story="reviews"
                text="Отзывы"
              >
                <Icon24Chats />
              </TabbarItem>
              <TabbarItem
                onClick={() => {
                  setActiveStory('profile');
                }}
                selected={activeStory === 'profile'}
                data-story="profile"
                label="12"
                text="Профиль"
              >
                <Icon24UserOutline />
              </TabbarItem>
            </Tabbar>
          }
        >
          <Find id="find" activePanel="find" />
          <Reviews id="reviews" activePanel="reviews" />
          <Profile id="profile" activePanel="profile" />
        </Epic>
      </AppRoot>
    </AdaptivityProvider>
  );
});

export default App;
