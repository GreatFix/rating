import React from 'react'
import { Icon24CupOutline, Icon24Fire } from '@vkontakte/icons'
import { observer } from 'mobx-react-lite'

const Popular = observer(({ positive, negative, side = 'right', mode = 'rating' }) => {
  const count = getCount(positive, negative, mode)
  const popular = getPopular(count)
  const activity = getActivity(count)
  return (
    <>
      {side === 'left' && count}
      {mode === 'rating' && <Icon24CupOutline fill={popular} />}
      {mode === 'activity' && <Icon24Fire fill={activity} />} {side === 'right' && count}
    </>
  )
})

export default Popular

function getPopular(count) {
  if (count > 0) return '#47C147'
  if (count < 0) return '#FF3D50'
  return '#99A2AD'
}
function getActivity(count) {
  if (count > 1000) return '#ff3347'
  if (count > 500) return '#ff724c'
  if (count > 100) return '#f05c44'
  if (count > 10) return '#ffa000'
  if (count > 5) return '#ffc107'
  return '#2787f5'
}
function getCount(positive = 0, negative = 0, mode) {
  switch (mode) {
    case 'rating':
      return Number(positive) - Number(negative)
    case 'activity':
      return Number(positive) + Number(negative)
    default:
      return Number(positive) + Number(negative)
  }
}
