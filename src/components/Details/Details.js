import React from 'react'
import { Separator, MiniInfoCell, UsersStack } from '@vkontakte/vkui'
import {
  Icon20LockOutline,
  Icon20HomeOutline,
  Icon20MentionOutline,
  Icon20MessageOutline,
  Icon20UsersOutline,
  Icon24PhotosStackOutline,
  Icon24Attachments,
  Icon20VideocamOutline,
} from '@vkontakte/icons'
import { observer } from 'mobx-react-lite'

const USER = 'user'
const GROUP = 'group'
const Details = observer(({ target, type }) => {
  return (
    <>
      {target.data?.status && (
        <MiniInfoCell before={<Icon20MessageOutline />} textWrap="short" textLevel="primary">
          {target.data?.status}
        </MiniInfoCell>
      )}

      {target.data?.city && (
        <MiniInfoCell before={<Icon20HomeOutline />} textWrap="nowrap" textLevel="primary">
          {target.data?.city?.title}
        </MiniInfoCell>
      )}

      {type === USER && (target.data?.countFriends || target.data?.common_count) && (
        <MiniInfoCell
          before={<Icon20UsersOutline />}
          after={<UsersStack photos={target.data?.friends?.map((friend) => friend?.photo_50)} />}
        >
          {target.data?.countFriends === 5000 ? `Болee ${target.data?.countFriends}` : target.data?.countFriends} друзей
          {!!target.data?.common_count &&
            ` · ${target.data?.common_count} 
      общих`}
        </MiniInfoCell>
      )}

      {type === GROUP && target.data?.members_count && (
        <MiniInfoCell before={<Icon20UsersOutline />} after={target.data?.members_count}>{`${
          target.data?.type === 'page' ? 'Подписчики' : 'Участники'
        }`}</MiniInfoCell>
      )}

      {type === GROUP && target.data?.counters?.albums && (
        <MiniInfoCell before={<Icon24Attachments width={20} height={20} />} after={target.data?.counters?.albums}>
          Фотоальбомы
        </MiniInfoCell>
      )}

      {type === GROUP && target.data?.counters?.photos && (
        <MiniInfoCell
          before={<Icon24PhotosStackOutline width={20} height={20} />}
          after={target.data?.counters?.photos}
        >
          Фотографии
        </MiniInfoCell>
      )}

      {type === GROUP && target.data?.counters?.videos && (
        <MiniInfoCell before={<Icon20VideocamOutline />} after={target.data?.counters?.videos}>
          Видеозаписи
        </MiniInfoCell>
      )}

      <Separator style={{ marginTop: 12, marginBottom: 12 }} />

      <MiniInfoCell before={<Icon20MentionOutline />}>{target.data?.domain ?? target.data?.screen_name}</MiniInfoCell>

      {type === USER && target.data?.is_closed && (
        <MiniInfoCell before={<Icon20LockOutline />}>Закрытый профиль</MiniInfoCell>
      )}
    </>
  )
})

export default Details
