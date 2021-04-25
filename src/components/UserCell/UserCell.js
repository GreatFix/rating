import React, { useCallback } from 'react'
import { RichCell, Avatar, Text } from '@vkontakte/vkui'
import { Icon12OnlineMobile, Icon12OnlineVkmobile, Icon24AppleOutline, Icon24ComputerOutline } from '@vkontakte/icons'
import Popular from '../Popular/Popular'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'

const ONLINE_PLATFORM = {
  1: <Icon12OnlineVkmobile />,
  2: <Icon24AppleOutline width={12} height={12} />,
  3: <Icon24AppleOutline width={12} height={12} />,
  4: <Icon12OnlineMobile />,
  5: <Icon12OnlineMobile />,
  6: <Icon24ComputerOutline width={12} height={12} />,
  7: <Icon24ComputerOutline width={12} height={12} />,
}

const UserCell = observer(({ user, onClick, mode = 'rating' }) => {
  const handleClickUser = useCallback(() => {
    onClick(user, 'user')
  }, [onClick, user])

  return (
    <RichCell
      before={<Avatar size={48} src={user.photo_50} />}
      text={user.city && user.city.title ? user.city.title : ''}
      caption={
        user.last_seen && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px' }}>
            <div>{DateTime.fromSeconds(user.last_seen?.time).toRelative()}</div>
            {ONLINE_PLATFORM[user.last_seen?.platform]}
          </div>
        )
      }
      multiline={true}
      after={
        <Text className="Popular-custom">
          <Popular
            positive={user?.countPositiveFeedbacks}
            negative={user?.countNegativeFeedbacks}
            side="left"
            mode={mode}
          />
        </Text>
      }
      onClick={handleClickUser}
    >
      {`${user.first_name} ${user.last_name}`}
    </RichCell>
  )
})

export default UserCell
