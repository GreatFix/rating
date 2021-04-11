import React from 'react';
import { RichCell, Avatar, Counter } from '@vkontakte/vkui';
import './GroupCell.css';

const GroupCell = ({ group, onClick }) => (
  <RichCell
    before={<Avatar size={48} src={group.photo_50} />}
    caption={group.type === 'page' ? `${group.members_count} подписчиков` : `${group.members_count} участников`}
    multiline={true}
    after={
      <div className="GroupReviews">
        <Counter size="s" className="GroupReviewsCounterPositive">
          {group.countPositiveFeedbacks ?? 0}
        </Counter>
        <Counter size="s" mode="prominent">
          {group.countNegativeFeedbacks ?? 0}
        </Counter>
      </div>
    }
    onClick={() => onClick(group)}
  >
    {`${group.name}`}
  </RichCell>
);

export default React.memo(GroupCell);
