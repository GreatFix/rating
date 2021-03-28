import React, { useState, useRef, useEffect, useCallback } from 'react';

import {
  Panel,
  PanelHeader,
  Tabs,
  TabsItem,
  Group,
  Placeholder,
  PanelSpinner,
  List,
  Button,
  Search,
} from '@vkontakte/vkui';
import { Icon56UsersOutline, Icon56ErrorTriangleOutline, Icon56Users3Outline } from '@vkontakte/icons';
import { observer } from 'mobx-react-lite';
import User from '../../../store/user';
import UserCell from '../components/UserCell/UserCell';
import GroupCell from '../components/GroupCell/GroupCell';
import DetailsUser from '../../../store/detailsUser';

const PANEL_SEARCH = 'PANEL_SEARCH';
const PANEL_DETAILS_USER = 'PANEL_DETAILS_USER';
const PANEL_DETAILS_GROUP = 'PANEL_DETAILS_GROUP';
const TAB_FRIENDS = 'TAB_FRIENDS';
const TAB_GROUPS = 'TAB_GROUPS';

const Main = observer(({ id, go }) => {
  const [activeTab, setActiveTab] = useState(TAB_FRIENDS);
  const offset = useRef(0);
  const scrollHeight = useRef(0);

  useEffect(() => {
    if (!(User.tokenFG.permission === 'denied')) {
      offset.current = 0;
      if (!User.tokenFG.token) {
        User.getTokenFG().then((res) => {
          if (activeTab === TAB_FRIENDS && !User.friends.fetched) {
            User.fetchFriends();
          } else if (activeTab === TAB_GROUPS && !User.groups.fetched) {
            User.fetchGroups();
          }
        });
      } else {
        if (activeTab === TAB_FRIENDS && !User.friends.fetched) {
          User.fetchFriends();
        } else if (activeTab === TAB_GROUPS && !User.groups.fetched) {
          User.fetchGroups();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const onScroll = (e) => {
    if (
      e.target.offsetHeight + e.target.scrollTop + 10 >= e.target.scrollHeight &&
      scrollHeight.current !== e.target.scrollHeight
    ) {
      scrollHeight.current = e.target.scrollHeight;
      offset.current = offset.current + 20;
      if (activeTab === TAB_FRIENDS) {
        User.fetchFriends(offset.current);
      } else if (activeTab === TAB_GROUPS) {
        User.fetchGroups(offset.current);
      }
    }
  };

  const onClickUser = useCallback(
    (user) => {
      DetailsUser.setId(user.id);
      DetailsUser.getInfo(User.token);
      go(PANEL_DETAILS_USER);
    },
    [go]
  );

  const onClickGroup = useCallback(
    (group) => {
      // DetailsGroup.setId(group.id);
      // DetailsGroup.getInfo(User.token);
      go(PANEL_DETAILS_GROUP);
    },
    [go]
  );

  return (
    <Panel id={id} onScroll={onScroll} className="Overflow">
      <PanelHeader>Найти</PanelHeader>
      <Search
        onFocus={() => {
          go(PANEL_SEARCH);
          User.clearFetchedInfo();
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
      {activeTab === TAB_FRIENDS ? (
        <Group>
          <List>
            {User.friends.fetched ? (
              User.friends.list.length > 0 ? (
                User.friends.list.map((friend) => <UserCell key={friend.id} user={friend} onClick={onClickUser} />)
              ) : (
                <Placeholder header={'Друзья'} icon={<Icon56UsersOutline />}>
                  Не найдено
                </Placeholder>
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
              <PanelSpinner />
            )}
          </List>
        </Group>
      ) : (
        <Group>
          <List>
            {User.groups.fetched ? (
              User.groups.list.length > 0 ? (
                User.groups.list.map((group) => <GroupCell key={group.id} group={group} onClick={onClickGroup} />)
              ) : (
                <Placeholder header={'Сообщества'} icon={<Icon56Users3Outline />}>
                  Не найдено
                </Placeholder>
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
              <PanelSpinner />
            )}
          </List>
        </Group>
      )}
    </Panel>
  );
});

export default Main;
