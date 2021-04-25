import React, { useCallback } from 'react'
import { RichCell, Avatar, Card, CardScroll } from '@vkontakte/vkui'
import { Icon16CommentOutline } from '@vkontakte/icons'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import BRIDGE_API from '../../API/bridge'
import classes from './Feedback.module.css'

const COLORS = {
  neutral: '#99A2AD',
  positive: '#47C147',
  negative: '#FF3D50',
}

const Feedback = observer(({ feedback, onClickReply, onClick }) => {
  const handleClickReply = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      onClickReply(feedback?.id, feedback?.first_name, feedback?.UserId)
    },
    [feedback?.id, feedback?.UserId, feedback?.first_name, onClickReply]
  )

  const handleClickImage = useCallback(
    (e) => {
      e.stopPropagation()
      const imageIndex = e.target.dataset.index
      const imagesUrl = feedback.images.map((img) => img.MaxSize.url)
      BRIDGE_API.SHOW_IMAGES(imagesUrl, imageIndex)
    },
    [feedback.images]
  )

  const handleClickFeedback = useCallback(
    (e) => {
      let node = e.target
      for (let i = 0; i < 10; i++) {
        if (Array.from(node.classList).join(' ').includes('arrow')) {
          e.stopPropagation()
          return
        }
        node = node.parentNode
      }

      e.stopPropagation()
      onClick(feedback)
    },
    [feedback, onClick]
  )

  return (
    <Card mode="shadow">
      <RichCell
        onClick={handleClickFeedback}
        multiline={true}
        before={<Avatar size={40} src={feedback?.photo_50} />}
        text={
          <>
            {feedback?.content}
            {feedback?.images?.length > 0 && (
              <CardScroll className={classes.CardScroll}>
                {feedback?.images?.map((img, index) => (
                  <Card key={img?.id} style={{ width: 'auto' }} onClick={handleClickImage}>
                    <Avatar mode="image" src={img?.MinSize?.url} data-index={index} size={80} alt="image" />
                  </Card>
                ))}
              </CardScroll>
            )}
          </>
        }
        caption={
          <div className={classes.FeedbackFooter}>
            <span>{DateTime.fromISO(feedback?.createdAt).toRelative()}</span>
            <a href="." onClick={handleClickReply}>
              Ответить
            </a>
          </div>
        }
        after={<Icon16CommentOutline fill={COLORS[feedback?.conclusion]} />}
      >
        {feedback?.last_name} {feedback?.first_name}
      </RichCell>
    </Card>
  )
})

export default Feedback
