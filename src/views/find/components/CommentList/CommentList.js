import React from 'react';
import classes from './CommentList.module.css';
import Comment from '../Comment/Comment';
import { List } from '@vkontakte/vkui';

const CommentList = ({ comments = [], feedbackIndex, onClickComment, onClickImage, onClickReply }) => {
  return (
    <List className={classes.CommentList}>
      {comments?.map((comment, index) => (
        <Comment
          key={index}
          comment={comment}
          feedbackIndex={feedbackIndex}
          commentIndex={index}
          onClick={onClickComment}
          onClickImage={onClickImage}
          onClickReply={onClickReply}
        />
      ))}
    </List>
  );
};

export default CommentList;
