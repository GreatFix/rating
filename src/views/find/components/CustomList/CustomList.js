import React from 'react';
import { List } from '@vkontakte/vkui';
import UserCell from '../UserCell/UserCell';
import GroupCell from '../GroupCell/GroupCell';
import { observer } from 'mobx-react-lite';

const CustomList = observer(({ array, onClick, cellType = 'UserCell' }) => (
  <List>
    {array.map((item) =>
      cellType === 'UserCell' ? (
        <UserCell key={item.id} user={item} onClick={onClick} />
      ) : (
        <GroupCell key={item.id} group={item} onClick={onClick} />
      )
    )}
  </List>
));

export default CustomList;
