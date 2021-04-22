import React from 'react'
import { Icon24CupOutline } from '@vkontakte/icons'
import { observer } from 'mobx-react-lite'

const COLORS = {
  neutral: '#99A2AD',
  positive: '#47C147',
  negative: '#FF3D50',
}

const Popular = observer(({ positive, negative }) => {
  const popular = getPopular(positive, negative)
  return (
    <>
      <Icon24CupOutline fill={COLORS[popular.rang]} /> {popular.count}
    </>
  )
})

export default Popular

function getPopular(positive = 0, negative = 0) {
  const count = Number(positive) - Number(negative)
  return count === 0
    ? { count, rang: 'neutral' }
    : count > 0
    ? { count, rang: 'positive' }
    : { count, rang: 'negative' }
}
