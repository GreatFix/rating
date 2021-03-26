import React from 'react';
import { observer } from 'mobx-react-lite';
import User from '../../../../store/user';
import DetailsUser from '../../../../store/detailsUser';
import { Group, Avatar, Placeholder, ScreenSpinner, Counter, RichCell } from '@vkontakte/vkui';
import './friends.css';

const Friends = observer(({ go }) => {
  if (!(User.tokenFG.permission === 'denied')) {
    if (!User.tokenFG.token) {
      User.getTokenFG();
    } else if (!User.friends.fetched) {
      User.fetchFriends();
    }
  }

  return (
    <Group>
      {User.friends.fetched ? (
        User.friends.list.length > 0 ? (
          User.friends.list.map((friend) => (
            <RichCell
              key={Math.random()}
              before={<Avatar size={48} src={friend.photo_50} />}
              text={friend.activities}
              caption={friend.city && friend.city.title ? friend.city.title : ''}
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
                DetailsUser.setId(friend.id);
                DetailsUser.getInfo(User.token);
                go('details');
              }}
            >
              {`${friend.first_name} ${friend.last_name}`}
            </RichCell>
          ))
        ) : (
          <Placeholder>Друзья</Placeholder>
        )
      ) : User.tokenFG.permission === 'denied' ? (
        <Placeholder>Отказано в доступе</Placeholder>
      ) : (
        <ScreenSpinner />
      )}
    </Group>
  );
});

export default Friends;
