import React, { useCallback } from 'react'
import { RichCell, Avatar, Card, CardGrid, Spacing } from '@vkontakte/vkui'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import BRIDGE_API from '../../API/bridge'
import classes from './Comment.module.css'

const Comment = observer(({ comment, feedbackIndex, onClickReply, onClick }) => {
  const handleClickReply = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      onClickReply(comment?.FeedbackId, comment?.first_name, comment?.UserId)
    },
    [comment?.FeedbackId, comment?.UserId, comment?.first_name, onClickReply]
  )

  const handleClickImage = useCallback(
    (e) => {
      e.stopPropagation()
      const imageIndex = e.target.dataset.index
      const imagesUrl = comment.images.map((img) => img.MaxSize.url)
      BRIDGE_API.SHOW_IMAGES(imagesUrl, imageIndex)
    },
    [comment.images]
  )

  const handleClickComment = useCallback(
    (e) => {
      e.stopPropagation()
      onClick(comment, feedbackIndex)
    },
    [comment, feedbackIndex, onClick]
  )

  const handleClickGreeting = useCallback((e) => {
    e.stopPropagation()
  }, [])

  return (
    <>
      <Spacing size={2} />
      <Card mode="outline">
        <RichCell
          className={classes.Comment}
          onClick={handleClickComment}
          multiline={true}
          before={<Avatar size={32} src={comment?.photo_50} />}
          text={
            <>
              {comment?.greetingName && (
                <a
                  className={classes.Greeting}
                  target={'_blank'}
                  href={`https://vk.com/id${comment?.greetingID}`}
                  rel="noreferrer"
                  onClick={handleClickGreeting}
                >
                  {comment?.greetingName},
                </a>
              )}
              {comment?.content}
              {comment?.images?.length > 0 && (
                <CardGrid size="s" className={classes.CardGrid}>
                  {comment?.images?.map((img, index) => (
                    <Card key={index} onClick={handleClickImage}>
                      <img data-index={index} src={img?.MinSize?.url} alt="comment-img" />
                    </Card>
                  ))}
                </CardGrid>
              )}
            </>
          }
          caption={
            <div className={classes.CommentFooter}>
              <span>{DateTime.fromISO(comment?.createdAt).toRelative()}</span>
              <a className={classes.Reply} href="." onClick={handleClickReply}>
                Ответить
              </a>
            </div>
          }
        >
          {comment?.last_name} {comment?.first_name}
        </RichCell>
      </Card>
    </>
  )
})

export default Comment
