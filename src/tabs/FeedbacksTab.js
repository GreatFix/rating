import React, { useCallback, useContext, useEffect } from 'react'
import { Icon56MessagesOutline } from '@vkontakte/icons'
import GroupWithList from '../components/GroupWithList/GroupWithList'
import { observer } from 'mobx-react-lite'
import BRIDGE_API from '../API/bridge'
import { StoreContext } from '../store/store'

const FeedbackTab = observer((props) => {
  const Store = useContext(StoreContext)

  const handleClickFeedback = useCallback(() => {
    BRIDGE_API.TAPTIC_IMPACT('light')
  }, [])
  const handleClickReply = useCallback(() => {
    BRIDGE_API.TAPTIC_IMPACT('light')
  }, [])

  useEffect(() => {
    if (Store.Interesting.feedbacks.list.length === 0) Store.Interesting.getRecentFeedbacks()
  }, [Store.Interesting])

  return (
    <GroupWithList
      object={Store.Interesting.feedbacks}
      altHeader={'Отзывы'}
      icon={<Icon56MessagesOutline />}
      onClick={handleClickFeedback}
      onClickReply={handleClickReply}
      cellType={'FeedbackCell'}
    />
  )
})

export default FeedbackTab
