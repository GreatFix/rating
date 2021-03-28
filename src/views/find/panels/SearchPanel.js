import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Group,
  FormItem,
  SliderSwitch,
  Placeholder,
  ScreenSpinner,
  List,
  Button,
  Search,
} from '@vkontakte/vkui';
import {
  Icon56UsersOutline,
  Icon56ErrorTriangleOutline,
  Icon56Users3Outline,
  Icon28SlidersOutline,
} from '@vkontakte/icons';
import { useDebounce } from 'use-lodash-debounce';
import User from '../../../store/user';
import DetailsUser from '../../../store/detailsUser';
import DetailsGroup from '../../../store/detailsGroup';
import { observer } from 'mobx-react-lite';
import UserCell from '../components/UserCell/UserCell';
import GroupCell from '../components/GroupCell/GroupCell';

const PANEL_DETAILS_USER = 'PANEL_DETAILS_USER';
const PANEL_DETAILS_GROUP = 'PANEL_DETAILS_GROUP';
const PANEL_MAIN = 'PANEL_MAIN';

const SearchPanel = observer(({ id, go, onClickFilters, filters }) => {
  const [searchSwitch, setSearchSwitch] = useState('users');
  const offset = useRef(0);
  const scrollHeight = useRef(0);
  const searchRef = useRef(null);

  const [text, setText] = useState('');
  const deferredText = useDebounce(text, 500);

  useEffect(() => {
    offset.current = 0;
    if (searchSwitch === 'users') {
      User.searchUsers(deferredText, filters);
    } else if (searchSwitch === 'groups' && deferredText) {
      User.searchGroups(deferredText, {});
    }
  }, [deferredText, filters, searchSwitch]);

  useEffect(() => {
    searchRef.current.focus();
  }, []);

  const onScroll = (e) => {
    if (
      e.target.offsetHeight + e.target.scrollTop + 10 >= e.target.scrollHeight &&
      scrollHeight.current !== e.target.scrollHeight
    ) {
      scrollHeight.current = e.target.scrollHeight;
      offset.current = offset.current + 20;
      if (searchSwitch === 'users') {
        User.searchUsers(deferredText, filters, offset.current);
      } else if (searchSwitch === 'groups') {
        User.searchGroups(deferredText, {}, offset.current);
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
      DetailsGroup.setId(group.id);
      DetailsGroup.getInfo(User.token);
      go(PANEL_DETAILS_GROUP);
    },
    [go]
  );

  return (
    <Panel id={id} className="Overflow" onScroll={onScroll}>
      <PanelHeader
        left={
          <PanelHeaderBack
            onClick={() => {
              go(PANEL_MAIN);
            }}
          />
        }
      >
        Поиск
      </PanelHeader>
      <Search
        getRef={searchRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        icon={searchSwitch === 'users' && <Icon28SlidersOutline width={24} height={24} />}
        onIconClick={searchSwitch === 'users' && onClickFilters}
      />
      <Group>
        <FormItem>
          <SliderSwitch
            activeValue={searchSwitch}
            options={[
              {
                name: 'Люди',
                value: 'users',
              },
              {
                name: 'Сообщества',
                value: 'groups',
              },
            ]}
            onSwitch={(value) => {
              setSearchSwitch(value);
            }}
          />
        </FormItem>
      </Group>
      {searchSwitch === 'users' ? (
        <Group>
          <List>
            {User.searchedUsers.fetched ? (
              User.searchedUsers.list.length > 0 ? (
                User.searchedUsers.list.map((user) => <UserCell key={user.id} user={user} onClick={onClickUser} />)
              ) : (
                <Placeholder header={'Люди'} icon={<Icon56UsersOutline />}>
                  Никого не найдено
                </Placeholder>
              )
            ) : !User.token ? (
              <Placeholder
                icon={<Icon56ErrorTriangleOutline />}
                action={
                  <Button
                    onClick={() => {
                      User.getToken();
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
          {User.searchedGroups.fetched ? (
            User.searchedGroups.list.length > 0 ? (
              User.searchedGroups.list.map((group) => <GroupCell key={group.id} group={group} onClick={onClickGroup} />)
            ) : (
              <Placeholder header={'Сообщества'} icon={<Icon56Users3Outline />}>
                Ничего не найдено
              </Placeholder>
            )
          ) : !deferredText ? (
            <Placeholder header={'Сообщества'} icon={<Icon56Users3Outline />}>
              Введите название для поиска
            </Placeholder>
          ) : (
            <ScreenSpinner />
          )}
        </Group>
      )}
    </Panel>
  );
});

export default SearchPanel;
