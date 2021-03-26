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
} from '@vkontakte/vkui';
import {
  Icon56UsersOutline,
  Icon56ErrorTriangleOutline,
  Icon56Users3Outline,
} from '@vkontakte/icons';
import Search from '../components/Search/Search';
import { useDebounce } from 'use-lodash-debounce';
import User from '../../../store/user';
import DetailsUser from '../../../store/detailsUser';
import DetailsGroup from '../../../store/detailsGroup';
import { observer } from 'mobx-react-lite';
import UserCell from '../components/UserCell/UserCell';
import GroupCell from '../components/GroupCell/GroupCell';

const SearchResult = observer(({ id, go }) => {
  const [searchSwitch, setSearchSwitch] = useState('users');
  const offset = useRef(0);
  const scrollHeight = useRef(0);

  const [text, setText] = useState('');
  const [filters, setFilters] = useState({});
  const deferredText = useDebounce(text, 500);

  useEffect(() => {
    offset.current = 0;
    if (searchSwitch === 'users') {
      User.searchUsers(deferredText, filters);
    } else if (searchSwitch === 'groups' && deferredText) {
      User.searchGroups(deferredText, filters);
    }
  }, [deferredText, filters, searchSwitch]);

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
        User.searchGroups(deferredText, filters, offset.current);
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
      DetailsGroup.setId(group.id);
      DetailsGroup.getInfo(User.token);
      go('detailsGroup');
    },
    [go]
  );

  return (
    <Panel id={id} className="Overflow" onScroll={onScroll}>
      <PanelHeader
        left={
          <PanelHeaderBack
            onClick={() => {
              go('main');
            }}
          />
        }
      >
        Поиск
      </PanelHeader>
      <Search
        focus={true}
        searchSwitch={searchSwitch}
        text={text}
        setText={setText}
        setFilters={setFilters}
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
                User.searchedUsers.list.map((user) => (
                  <UserCell key={user.id} user={user} onClick={onClickUser} />
                ))
              ) : (
                <Placeholder icon={<Icon56UsersOutline />}>Люди</Placeholder>
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
              User.searchedGroups.list.map((group) => (
                <GroupCell key={group.id} group={group} onClick={onClickGroup} />
              ))
            ) : (
              <Placeholder>
                <Icon56Users3Outline />
              </Placeholder>
            )
          ) : !deferredText ? (
            <Placeholder icon={<Icon56Users3Outline />}>Сообщества</Placeholder>
          ) : (
            <ScreenSpinner />
          )}
        </Group>
      )}
    </Panel>
  );
});

export default SearchResult;
