import React from 'react';
import { observer } from 'mobx-react-lite';
import User from '../../../../store/user';
import {
  RichCell,
  Group,
  Avatar,
  Placeholder,
  ScreenSpinner,
  Counter,
  Headline,
  Button,
} from '@vkontakte/vkui';
import './groups.css';

const Groups = observer(() => {
  if (!(User.tokenFG.permission === 'denied')) {
    if (!User.tokenFG.token) {
      User.getTokenFG();
    } else if (!User.groups.fetched) {
      User.fetchGroups();
    }
  }

  return (
    <Group>
      {User.groups.fetched ? (
        User.groups.list.length > 0 ? (
          User.groups.list.map((group) => (
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
  );
});

export default Groups;
