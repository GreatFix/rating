import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';

import { Panel, PanelHeader, Tabs, TabsItem, Placeholder, Button, Search } from '@vkontakte/vkui';
import { Icon56UsersOutline, Icon56ErrorTriangleOutline, Icon56Users3Outline } from '@vkontakte/icons';
import { observer } from 'mobx-react-lite';

import { StoreContext } from '../../../store/store';
import GroupWithList from '../components/GroupWithList/GroupWithList';

const PANEL_SEARCH = 'PANEL_SEARCH';
const PANEL_DETAILS_USER = 'PANEL_DETAILS_USER';
const PANEL_DETAILS_GROUP = 'PANEL_DETAILS_GROUP';
const TAB_FRIENDS = 'TAB_FRIENDS';
const TAB_GROUPS = 'TAB_GROUPS';
const COUNT = 20;

const Main = observer(({ id, go }) => {
  const Store = useContext(StoreContext);
  const [activeTab, setActiveTab] = useState(TAB_GROUPS);
  const offset = useRef(0);
  const scrollHeight = useRef(0);

  const onScroll = (e) => {
    if (
      e.target.offsetHeight + e.target.scrollTop + 10 >= e.target.scrollHeight &&
      scrollHeight.current !== e.target.scrollHeight
    ) {
      scrollHeight.current = e.target.scrollHeight;
      offset.current = offset.current + COUNT;
      if (activeTab === TAB_FRIENDS) {
        Store.bridge.fetchFriends(offset.current);
      } else if (activeTab === TAB_GROUPS) {
        Store.bridge.fetchGroups(offset.current);
      }
    }
  };

  const onClickUser = useCallback(
    (user) => {
      Store.detailsUser.setId(user.id);
      Store.detailsUser.getInfo();
      go(PANEL_DETAILS_USER);
    },
    [Store.detailsUser, go]
  );

  const onClickGroup = useCallback(
    (group) => {
      Store.detailsGroup.setId(group.id);
      Store.detailsGroup.getInfo();
      go(PANEL_DETAILS_GROUP);
    },
    [Store.detailsGroup, go]
  );

  useEffect(() => {
    if (Store.user.bridgeTokenFG.token) {
      offset.current = 0;
      if (activeTab === TAB_FRIENDS) {
        Store.bridge.fetchFriends();
      } else if (activeTab === TAB_GROUPS) {
        Store.bridge.fetchGroups();
      }
    }
  }, [Store.bridge, Store.user.bridgeTokenFG.token, activeTab]);

  return (
    <Panel id={id} onScroll={onScroll} className="Overflow">
      <PanelHeader>Найти</PanelHeader>
      <Search
        onFocus={() => {
          go(PANEL_SEARCH);
          Store.bridge.clearFetchedInfo();
        }}
      />
      <Tabs>
        <TabsItem
          onClick={() => {
            setActiveTab(TAB_FRIENDS);
          }}
          selected={activeTab === TAB_FRIENDS}
        >
          Друзья
        </TabsItem>
        <TabsItem
          onClick={() => {
            setActiveTab(TAB_GROUPS);
          }}
          selected={activeTab === TAB_GROUPS}
        >
          Сообщества
        </TabsItem>
      </Tabs>
      {Store.user.bridgeTokenFG.permission === 'denied' ? (
        <Placeholder
          icon={<Icon56ErrorTriangleOutline />}
          action={
            <Button onClick={Store.user.getBridgeTokenFG} size="m">
              Дать доступ
            </Button>
          }
        >
          Доступ запрещен
        </Placeholder>
      ) : activeTab === TAB_FRIENDS ? (
        <GroupWithList
          object={Store.bridge.friends}
          altHeader={'Друзья'}
          icon={<Icon56UsersOutline />}
          onClick={onClickUser}
          cellType={'UserCell'}
        />
      ) : (
        <GroupWithList
          object={Store.bridge.groups}
          altHeader={'Сообщества'}
          icon={<Icon56Users3Outline />}
          onClick={onClickGroup}
          cellType={'GroupCell'}
        />
      )}
    </Panel>
  );
});

export default Main;
