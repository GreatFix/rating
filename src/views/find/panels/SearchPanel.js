import React, { useState } from 'react';
import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Group,
  FormItem,
  SliderSwitch,
  RichCell,
  Avatar,
  Counter,
  Placeholder,
  ScreenSpinner,
} from '@vkontakte/vkui';

import Search from '../components/Search/Search';

import User from '../../../store/user';
import DetailsUser from '../../../store/detailsUser';
import { observer } from 'mobx-react-lite';

const SearchResult = observer(({ id, go }) => {
  const [searchSwitch, setSearchSwitch] = useState('users');
  console.log(searchSwitch);
  return (
    <Panel id={id}>
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
      <Search focus={true} searchSwitch={searchSwitch} />
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
          {User.searchedUsers.fetched ? (
            User.searchedUsers.list.length > 0 ? (
              User.searchedUsers.list.map((user) => (
                <RichCell
                  key={Math.random()}
                  before={<Avatar size={48} src={user.photo_50} />}
                  text={user.activities}
                  caption={user.city && user.city.title ? user.city.title : ''}
                  multiline={true}
                  after={
                    <div className="UserReviews">
                      <Counter size="s" className="UserReviewsCounterPositive">
                        3
                      </Counter>
                      <Counter size="s" mode="prominent">
                        3
                      </Counter>
                    </div>
                  }
                  onClick={() => {
                    DetailsUser.setId(user.id);
                    DetailsUser.getInfo(User.token);
                    go('details');
                  }}
                >
                  {`${user.first_name} ${user.last_name}`}
                </RichCell>
              ))
            ) : (
              <Placeholder>Люди</Placeholder>
            )
          ) : User.tokenFG.permission === 'denied' ? (
            <Placeholder>Отказано в доступе</Placeholder>
          ) : (
            <ScreenSpinner />
          )}
        </Group>
      ) : (
        <Group>
          {User.searchedGroups.fetched ? (
            User.searchedGroups.list.length > 0 ? (
              User.searchedGroups.list.map((group) => (
                <RichCell
                  key={Math.random()}
                  before={<Avatar size={48} src={group.photo_50} />}
                  //text={group.city && group.city.title ? group.city.title : ''}
                  caption={
                    group.type === 'page'
                      ? `${group.members_count} подписчиков`
                      : `${group.members_count} участников`
                  }
                  multiline={true}
                  after={
                    <div className="GroupReviews">
                      <Counter size="s" className="GroupReviewsCounterPositive">
                        3
                      </Counter>
                      <Counter size="s" mode="prominent">
                        3
                      </Counter>
                    </div>
                  }
                >
                  {`${group.name}`}
                </RichCell>
              ))
            ) : (
              <Placeholder>Сообщества</Placeholder>
            )
          ) : User.tokenFG.permission === 'denied' ? (
            <Placeholder>Отказано в доступе</Placeholder>
          ) : (
            <ScreenSpinner />
          )}
        </Group>
      )}
    </Panel>
  );
});

export default SearchResult;
