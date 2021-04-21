import React from 'react';
import { RichCell, Avatar, Counter } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import './UserCell.css';

const UserCell = observer(({ user, onClick }) => (
  <RichCell
    before={<Avatar size={48} src={user.photo_50} />}
    text={user.activities}
    caption={user.city && user.city.title ? user.city.title : ''}
    multiline={true}
    after={
      <div className="UserReviews">
        <Counter size="s" className="UserReviewsCounterPositive">
          {user.countPositiveFeedbacks ?? 0}
        </Counter>
        <Counter size="s" mode="prominent">
          {user.countNegativeFeedbacks ?? 0}
        </Counter>
      </div>
    }
    onClick={() => onClick(user)}
  >
    {`${user.first_name} ${user.last_name}`}
  </RichCell>
));

export default UserCell;
