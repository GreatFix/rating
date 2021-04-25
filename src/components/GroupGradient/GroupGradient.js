import React from 'react'
import { Avatar, Gradient, MiniInfoCell, Title, Text, Spinner, PanelSpinner, Link } from '@vkontakte/vkui'
import { Icon20Info, Icon24UserAddOutline, Icon24UserAddedOutline } from '@vkontakte/icons'
import Popular from '../Popular/Popular'
import { observer } from 'mobx-react-lite'

const GroupGradient = observer(({ group, feedbacks, onClickDetails }) => {
  return (
    <Gradient className="Gradient-custom" mode="white">
      <Avatar size={96} src={group.data?.photo_100}>
        {group.fetching && <PanelSpinner />}
      </Avatar>
      <Title className="Title-custom" level="2" weight="medium">
        {group.fetching ? (
          <Spinner />
        ) : (
          <Link target={'_blank'} href={`https://vk.com/club${group.data?.id}`} rel="noreferrer">
            {group.data?.name}
          </Link>
        )}
        {group.data?.is_member ? (
          <Icon24UserAddedOutline fill={'#3f8ae0'} />
        ) : (
          <Icon24UserAddOutline fill={'#3f8ae0'} />
        )}
      </Title>
      {feedbacks?.fetching ? (
        <Spinner />
      ) : (
        <Text className="HeaderWithCounter-custom">
          <Popular
            positive={feedbacks?.data?.countPositiveFeedbacks}
            negative={feedbacks?.data?.countNegativeFeedbacks}
          />
        </Text>
      )}
      <MiniInfoCell before={<Icon20Info />} mode="more" onClick={onClickDetails}>
        Подробная информация
      </MiniInfoCell>
    </Gradient>
  )
})

export default GroupGradient
