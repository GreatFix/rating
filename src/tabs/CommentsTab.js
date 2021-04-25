import React, { useCallback, useContext, useEffect } from 'react'
import { Icon24CommentOutline } from '@vkontakte/icons'
import GroupWithList from '../components/GroupWithList/GroupWithList'
import { observer } from 'mobx-react-lite'
import BRIDGE_API from '../API/bridge'
import { StoreContext } from '../store/store'

const CommentTab = observer(() => {
  const Store = useContext(StoreContext)

  const handleClickComment = useCallback(() => {
    BRIDGE_API.TAPTIC_IMPACT('light')
  }, [])
  const handleClickReply = useCallback(() => {
    BRIDGE_API.TAPTIC_IMPACT('light')
  }, [])

  useEffect(() => {
    if (Store.Interesting.comments.list.length === 0) Store.Interesting.getRecentComments()
  }, [Store.Interesting])

  return (
    <GroupWithList
      object={Store.Interesting.comments}
      altHeader={'Комментарии'}
      icon={<Icon24CommentOutline width={56} height={56} />}
      onClick={handleClickComment}
      onClickReply={handleClickReply}
      cellType={'CommentCell'}
    />
  )
})

export default CommentTab
