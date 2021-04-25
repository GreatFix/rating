import React from 'react'
import { List } from '@vkontakte/vkui'
import Comment from '../Comment/Comment'
import { observer } from 'mobx-react-lite'
import classes from './CommentList.module.css'

const CommentList = observer(({ comments = [], feedbackIndex, onClickComment, onClickReply }) => {
  return (
    <List className={classes.CommentList}>
      {comments?.map((comment, index) => (
        <Comment
          key={index}
          comment={comment}
          feedbackIndex={feedbackIndex}
          commentIndex={index}
          onClick={onClickComment}
          onClickReply={onClickReply}
        />
      ))}
    </List>
  )
})

export default CommentList
