import React, { useState } from 'react';

import { Panel, Tabs, TabsItem } from '@vkontakte/vkui';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';

import { observer } from 'mobx-react-lite';

import Friends from '../components/Friends/Friends';
import Groups from '../components/Groups/Groups';
import Search from '../components/Search/Search';

const Main = observer(({ id, go }) => {
  const [activeTab, setActiveTab] = useState('friends');

  return (
    <Panel id={id}>
      <PanelHeader>Найти</PanelHeader>
      <Search
        onFocus={() => {
          go('searchPanel');
        }}
      />
      <Tabs>
        <TabsItem
          onClick={() => {
            setActiveTab('friends');
          }}
          selected={activeTab === 'friends'}
        >
          Друзья
        </TabsItem>
        <TabsItem
          onClick={() => {
            setActiveTab('groups');
          }}
          selected={activeTab === 'groups'}
        >
          Сообщества
        </TabsItem>
      </Tabs>
      {activeTab === 'friends' && <Friends go={go} />}
      {activeTab === 'groups' && <Groups go={go} />}
    </Panel>
  );
});

export default Main;
