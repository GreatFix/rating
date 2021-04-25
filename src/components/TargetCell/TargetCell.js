import React, { useCallback } from 'react'
import { RichCell, Avatar, Text } from '@vkontakte/vkui'
import Popular from '../Popular/Popular'
import { observer } from 'mobx-react-lite'

const TargetCell = observer(({ target, onClick }) => {
  const handleClickTarget = useCallback(() => {
    onClick(target, target?.type)
  }, [onClick, target])

  return target?.type === 'user' ? (
    <RichCell
      before={<Avatar size={48} src={target.photo_50} />}
      text={target.activities}
      caption={target.city && target.city.title ? target.city.title : ''}
      multiline={true}
      after={
        <Text className="Popular-custom">
          <Popular positive={target?.countPositiveFeedbacks} negative={target?.countNegativeFeedbacks} side="left" />
        </Text>
      }
      onClick={handleClickTarget}
    >
      {`${target.first_name} ${target.last_name}`}
    </RichCell>
  ) : (
    <RichCell
      before={<Avatar size={48} src={target.photo_50} />}
      caption={target.type === 'page' ? `${target.members_count} подписчиков` : `${target.members_count} участников`}
      multiline={true}
      after={
        <Text className="Popular-custom">
          <Popular positive={target?.countPositiveFeedbacks} negative={target?.countNegativeFeedbacks} side="left" />
        </Text>
      }
      onClick={handleClickTarget}
    >
      {`${target.name}`}
    </RichCell>
  )
})

export default TargetCell
