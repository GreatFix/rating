import React, { useCallback } from 'react'
import { RichCell, Avatar, Text } from '@vkontakte/vkui'
import Popular from '../Popular/Popular'
import { observer } from 'mobx-react-lite'

const GroupCell = observer(({ group, onClick }) => {
  const handleClickGroup = useCallback(() => {
    onClick(group, 'group')
  }, [onClick, group])
  return (
    <RichCell
      before={<Avatar size={48} src={group.photo_50} />}
      caption={group.type === 'page' ? `${group.members_count} подписчиков` : `${group.members_count} участников`}
      multiline={true}
      after={
        <Text className="Popular-custom">
          <Popular positive={group?.countPositiveFeedbacks} negative={group?.countNegativeFeedbacks} side="left" />
        </Text>
      }
      onClick={handleClickGroup}
    >
      {`${group.name}`}
    </RichCell>
  )
})

export default GroupCell
