import React from 'react'
import { Avatar, Gradient, MiniInfoCell, Title, Text, Spinner, PanelSpinner, Link } from '@vkontakte/vkui'
import { Icon20Info, Icon24UserAddOutline, Icon24UserAddedOutline } from '@vkontakte/icons'
import Popular from '../Popular/Popular'
import { observer } from 'mobx-react-lite'

const UserGradient = observer(({ user, feedbacks, onClickDetails }) => {
  return (
    <Gradient className="Gradient-custom" mode="white">
      <Avatar size={96} src={user.data?.photo_100}>
        {user.fetching && <PanelSpinner />}
      </Avatar>
      <Title className="Title-custom" level="2" weight="medium">
        {user.fetching ? (
          <Spinner />
        ) : (
          <Link target={'_blank'} href={`https://vk.com/id${user.data?.id}`} rel="noreferrer">
            {`${user.data?.first_name} ${user.data?.last_name}`}
          </Link>
        )}

        {user.data?.is_friend ? <Icon24UserAddedOutline fill={'#3f8ae0'} /> : <Icon24UserAddOutline fill={'#3f8ae0'} />}
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

export default UserGradient
