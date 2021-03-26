import React, { useState, useRef, useEffect, useCallback } from 'react';

import {
  Panel,
  PanelHeader,
  Tabs,
  TabsItem,
  Group,
  Placeholder,
  ScreenSpinner,
  List,
  Button,
} from '@vkontakte/vkui';
import {
  Icon56UsersOutline,
  Icon56ErrorTriangleOutline,
  Icon56Users3Outline,
} from '@vkontakte/icons';
import { observer } from 'mobx-react-lite';
import User from '../../../store/user';
import Search from '../components/Search/Search';
import UserCell from '../components/UserCell/UserCell';
import GroupCell from '../components/GroupCell/GroupCell';
import DetailsUser from '../../../store/detailsUser';

const Main = observer(({ id, go }) => {
  const [activeTab, setActiveTab] = useState('friends');
  const offset = useRef(0);
  const scrollHeight = useRef(0);

  useEffect(() => {
    if (!(User.tokenFG.permission === 'denied')) {
      if (!User.tokenFG.token) {
        User.getTokenFG();
      } else {
        offset.current = 0;
        if (activeTab === 'friends' && !User.friends.fetched) {
          User.fetchFriends();
        } else if (activeTab === 'groups' && !User.groups.fetched) {
          User.fetchGroups();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, User.tokenFG.token]);

  const onScroll = (e) => {
    if (
      e.target.offsetHeight + e.target.scrollTop + 10 >= e.target.scrollHeight &&
      scrollHeight.current !== e.target.scrollHeight
    ) {
      scrollHeight.current = e.target.scrollHeight;
      offset.current = offset.current + 20;
      if (activeTab === 'friends') {
        User.fetchFriends(offset.current);
      } else if (activeTab === 'groups') {
        User.fetchGroups(offset.current);
      }
    }
  };

  const onClickUser = useCallback(
    (user) => {
      DetailsUser.setId(user.id);
      DetailsUser.getInfo(User.token);
      go('detailsUser');
    },
    [go]
  );

  const onClickGroup = useCallback(
    (group) => {
      // DetailsGroup.setId(group.id);
      // DetailsGroup.getInfo(User.token);
      go('detailsGroup');
    },
    [go]
  );

  return (
    <Panel id={id} onScroll={onScroll} className="Overflow">
      <PanelHeader>Найти</PanelHeader>
      <Search
        onFocus={() => {
          go('searchPanel');
          User.clearFetchedInfo();
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
      {activeTab === 'friends' ? (
        <Group>
          <List>
            {User.friends.fetched ? (
              User.friends.list.length > 0 ? (
                User.friends.list.map((friend) => (
                  <UserCell key={friend.id} user={friend} onClick={onClickUser} />
                ))
              ) : (
                <Placeholder icon={<Icon56UsersOutline />}>Друзья</Placeholder>
              )
            ) : User.tokenFG.permission === 'denied' ? (
              <Placeholder
                icon={<Icon56ErrorTriangleOutline />}
                action={
                  <Button
                    onClick={() => {
                      User.getTokenFG();
                    }}
                    size="m"
                  >
                    Дать доступ
                  </Button>
                }
              >
                Доступ запрещен
              </Placeholder>
            ) : (
              <ScreenSpinner />
            )}
          </List>
        </Group>
      ) : (
        <Group>
          <List>
            {User.groups.fetched ? (
              User.groups.list.length > 0 ? (
                User.groups.list.map((group) => (
                  <GroupCell key={group.id} group={group} onClick={onClickGroup} />
                ))
              ) : (
                <Placeholder icon={<Icon56Users3Outline />}>Сообщества</Placeholder>
              )
            ) : User.tokenFG.permission === 'denied' ? (
              <Placeholder
                icon={<Icon56ErrorTriangleOutline />}
                action={
                  <Button
                    onClick={() => {
                      User.getTokenFG();
                    }}
                    size="m"
                  >
                    Дать доступ
                  </Button>
                }
              >
                Доступ запрещен
              </Placeholder>
            ) : (
              <ScreenSpinner />
            )}
          </List>
        </Group>
      )}
    </Panel>
  );
});

export default Main;
