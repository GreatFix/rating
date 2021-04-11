import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Group,
  FormItem,
  SliderSwitch,
  Placeholder,
  Search,
} from '@vkontakte/vkui';
import { Icon56UsersOutline, Icon56Users3Outline, Icon28SlidersOutline } from '@vkontakte/icons';
import { useDebounce } from 'use-lodash-debounce';
import GroupWithList from '../components/GroupWithList/GroupWithList';
import { StoreContext } from '../../../store/store';
import { observer } from 'mobx-react-lite';

const PANEL_DETAILS_USER = 'PANEL_DETAILS_USER';
const PANEL_DETAILS_GROUP = 'PANEL_DETAILS_GROUP';
const PANEL_MAIN = 'PANEL_MAIN';

const SWITCH_USERS = 'SWITCH_USERS';
const SWITCH_GROUPS = 'SWITCH_GROUPS';
const COUNT = 20;

const SearchPanel = observer(({ id, go, onClickFilters, filters }) => {
  const Store = useContext(StoreContext);
  const [searchSwitch, setSearchSwitch] = useState(SWITCH_USERS);
  const offset = useRef(0);
  const scrollHeight = useRef(0);
  const searchRef = useRef(null);

  const [text, setText] = useState('');
  const deferredText = useDebounce(text, 500);

  const onScroll = (e) => {
    if (
      e.target.offsetHeight + e.target.scrollTop + 10 >= e.target.scrollHeight &&
      scrollHeight.current !== e.target.scrollHeight
    ) {
      scrollHeight.current = e.target.scrollHeight;
      offset.current = offset.current + COUNT;
      if (searchSwitch === SWITCH_USERS) {
        Store.bridge.searchUsers(deferredText, filters, offset.current);
      } else if (searchSwitch === SWITCH_GROUPS) {
        Store.bridge.searchGroups(deferredText, {}, offset.current);
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
    offset.current = 0;
    if (searchSwitch === SWITCH_USERS) {
      Store.bridge.searchUsers(deferredText, filters);
    } else if (searchSwitch === SWITCH_GROUPS && deferredText) {
      Store.bridge.searchGroups(deferredText, {});
    }
  }, [Store.bridge, deferredText, filters, searchSwitch]);

  useEffect(() => {
    searchRef.current.focus();
  }, []);

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
        icon={searchSwitch === SWITCH_USERS && <Icon28SlidersOutline width={24} height={24} />}
        onIconClick={searchSwitch === SWITCH_USERS && onClickFilters}
      />
      <Group>
        <FormItem>
          <SliderSwitch
            activeValue={searchSwitch}
            options={[
              {
                name: 'Люди',
                value: SWITCH_USERS,
              },
              {
                name: 'Сообщества',
                value: SWITCH_GROUPS,
              },
            ]}
            onSwitch={(value) => {
              setSearchSwitch(value);
            }}
          />
        </FormItem>
      </Group>
      {searchSwitch === SWITCH_USERS ? (
        <GroupWithList
          object={Store.bridge.searchedUsers}
          altHeader={'Люди'}
          icon={<Icon56UsersOutline />}
          onClick={onClickUser}
          cellType={'UserCell'}
        />
      ) : !deferredText ? (
        <Placeholder header={'Сообщества'} icon={<Icon56Users3Outline />}>
          Введите название для поиска
        </Placeholder>
      ) : (
        <GroupWithList
          object={Store.bridge.searchedGroups}
          altHeader={'Сообщества'}
          icon={<Icon56Users3Outline />}
          onClick={onClickGroup}
          cellType={'GroupCell'}
        />
      )}
    </Panel>
  );
});

export default SearchPanel;
