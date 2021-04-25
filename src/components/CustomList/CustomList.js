import React from 'react'
import { List, Text } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import UserCell from '../UserCell/UserCell'
import GroupCell from '../GroupCell/GroupCell'
import TargetCell from '../TargetCell/TargetCell'
import Feedback from '../Feedback/Feedback'
import Comment from '../Comment/Comment'

const CustomList = observer(({ array, onClick, cellType = 'UserCell', onClickReply, mode }) => (
  <List>
    {array.map((item) => {
      switch (cellType) {
        case 'UserCell':
          return <UserCell key={item.id} user={item} onClick={onClick} mode={mode} />
        case 'GroupCell':
          return <GroupCell key={item.id} group={item} onClick={onClick} />
        case 'TargetCell':
          return <TargetCell key={item.id} target={item} onClick={onClick} />
        case 'FeedbackCell':
          return <Feedback key={item.id} feedback={item} onClick={onClick} onClickReply={onClickReply} />
        case 'CommentCell':
          return <Comment key={item.id} comment={item} onClick={onClick} onClickReply={onClickReply} />
        default:
          return <Text>Элемент не распознан</Text>
      }
    })}
  </List>
))

export default CustomList
