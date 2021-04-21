import React from 'react';
import { Separator, MiniInfoCell, UsersStack } from '@vkontakte/vkui';
import {
  Icon20LockOutline,
  Icon20HomeOutline,
  Icon20MentionOutline,
  Icon20MessageOutline,
  Icon20UsersOutline,
} from '@vkontakte/icons';
import { observer } from 'mobx-react-lite';

const Details = observer(({ user }) => {
  return (
    <>
      {user.data?.status && (
        <MiniInfoCell before={<Icon20MessageOutline />} textWrap="short" textLevel="primary">
          {user.data?.status}
        </MiniInfoCell>
      )}

      {user.data?.city && (
        <MiniInfoCell before={<Icon20HomeOutline />} textWrap="nowrap" textLevel="primary">
          {user.data?.city?.title}
        </MiniInfoCell>
      )}

      {(user.data?.countFriends || user.data?.common_count) && (
        <MiniInfoCell
          before={<Icon20UsersOutline />}
          after={<UsersStack photos={user.data?.friends?.map((friend) => friend?.photo_50)} />}
        >
          {user.data?.countFriends === 5000 ? `Болee ${user.data?.countFriends}` : user.data?.countFriends} друзей
          {!!user.data?.common_count &&
            ` · ${user.data?.common_count} 
      общих`}
        </MiniInfoCell>
      )}

      <Separator style={{ marginTop: 12, marginBottom: 12 }} />

      <MiniInfoCell before={<Icon20MentionOutline />}>@{user.data?.domain}</MiniInfoCell>

      {user.data?.is_closed && <MiniInfoCell before={<Icon20LockOutline />}>Закрытый профиль</MiniInfoCell>}
    </>
  );
});

export default Details;
