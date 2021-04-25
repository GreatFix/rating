import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import {
  CellButton,
  Group,
  Header,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  PanelSpinner,
  ActionSheet,
  ActionSheetItem,
  IOS,
  usePlatform,
  Snackbar,
  Avatar,
} from '@vkontakte/vkui'
import {
  Icon28AddOutline,
  Icon28DeleteOutline,
  Icon28DeleteOutlineAndroid,
  Icon28EditOutline,
  Icon28WarningTriangleOutline,
  Icon16Done,
} from '@vkontakte/icons'
import Feedback from '../components/Feedback/Feedback'
import CommentList from '../components/CommentList/CommentList'
import CustomWriteBar from '../components/CustomWriteBar/CustomWriteBar'
import UserGradient from '../components/UserGradient/UserGradient'
import GroupGradient from '../components/GroupGradient/GroupGradient'
import CounterFeedbacks from '../components/CounterFeedbacks/CounterFeedbacks'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../store/store'

const PANEL_FEEDBACK = 'PANEL_FEEDBACK'
const PANEL_COMMENT = 'PANEL_COMMENT'
const CREATE_FEEDBACK = 'createFeedback'
const UPDATE_FEEDBACK = 'updateFeedback'
const UPDATE_COMMENT = 'updateComment'
const USER = 'user'
const GROUP = 'group'
const TargetPanel = observer(({ id, go, onClickDetails, setPopout }) => {
  const Store = useContext(StoreContext)
  const platform = usePlatform()
  const reviewsRef = useRef()
  const [snack, setSnack] = useState(null)

  const handleClickReport = useCallback(
    (item) => {
      if (snack) return
      setSnack(
        <Snackbar
          onClose={() => setSnack(null)}
          before={
            <Avatar size={24} style={{ background: 'var(--accent)' }}>
              <Icon16Done fill="#fff" width={14} height={14} />
            </Avatar>
          }
          after={<Avatar src={item.photo_50} size={50} />}
        >
          Жалоба отправлена
        </Snackbar>
      )
    },
    [snack]
  )

  const handleClickAddFeedback = useCallback(() => {
    go.forward(PANEL_FEEDBACK)
    Store.Feedback.init({ type: CREATE_FEEDBACK })
  }, [Store.Feedback, go])

  const handleClickEditFeedback = useCallback(
    (feedback) => {
      go.forward(PANEL_FEEDBACK)
      Store.Feedback.init({
        type: UPDATE_FEEDBACK,
        conclusion: feedback.conclusion,
        images: feedback.images,
        content: feedback.content,
        feedbackID: feedback.id,
      })
    },
    [Store.Feedback, go]
  )

  const handleClickDeleteFeedback = useCallback(
    async (feedback) => {
      try {
        const result = await Store.Feedback.deleteFeedback(feedback.id)
        if (result) Store.Target.popFeedback(feedback.id)
      } catch (err) {
        console.error(err)
      }
    },
    [Store.Feedback, Store.Target]
  )

  const handleClickFeedback = useCallback(
    (feedback) => {
      const author = feedback.UserId === Store.User.userID
      if (author) {
        setPopout(
          <ActionSheet
            onClose={() => setPopout(null)}
            iosCloseItem={
              <ActionSheetItem autoclose mode="cancel">
                Отменить
              </ActionSheetItem>
            }
          >
            <ActionSheetItem onClick={() => handleClickEditFeedback(feedback)} autoclose before={<Icon28EditOutline />}>
              Редактировать
            </ActionSheetItem>
            <ActionSheetItem
              onClick={() => handleClickDeleteFeedback(feedback)}
              autoclose
              before={platform === IOS ? <Icon28DeleteOutline /> : <Icon28DeleteOutlineAndroid />}
              mode="destructive"
            >
              Удалить
            </ActionSheetItem>
          </ActionSheet>
        )
      } else {
        setPopout(
          <ActionSheet
            onClose={() => setPopout(null)}
            iosCloseItem={
              <ActionSheetItem autoclose mode="cancel">
                Отменить
              </ActionSheetItem>
            }
          >
            <ActionSheetItem
              onClick={() => {
                handleClickReport(feedback)
              }}
              autoclose
              before={<Icon28WarningTriangleOutline />}
            >
              Пожаловаться
            </ActionSheetItem>
          </ActionSheet>
        )
      }
    },
    [Store.User.userID, handleClickDeleteFeedback, handleClickEditFeedback, handleClickReport, platform, setPopout]
  )

  const handleClickReply = useCallback(
    (feedbackId, greetingName, greetingID) => {
      Store.Comment.init({
        feedbackId,
        greetingName,
        greetingID,
        content: `${greetingName}, `,
      })
      Store.Target.setReply(true)
    },
    [Store.Comment, Store.Target]
  )

  const handleClickEditComment = useCallback(
    (comment) => {
      go.forward(PANEL_COMMENT)
      Store.Comment.init({
        type: UPDATE_COMMENT,
        images: comment.images,
        content: comment.content,
        commentID: comment.id,
      })
    },
    [Store.Comment, go]
  )

  const handleClickDeleteComment = useCallback(
    async (feedback, feedbackIndex) => {
      try {
        const result = await Store.Comment.deleteComment(feedback.id)
        if (result) Store.Target.popComment(feedback.id, feedbackIndex)
      } catch (err) {
        console.error(err)
      }
    },
    [Store.Comment, Store.Target]
  )

  const handleClickComment = useCallback(
    (comment, feedbackIndex) => {
      const author = comment.UserId === Store.User.userID
      if (author) {
        setPopout(
          <ActionSheet
            onClose={() => setPopout(null)}
            iosCloseItem={
              <ActionSheetItem autoclose mode="cancel">
                Отменить
              </ActionSheetItem>
            }
          >
            <ActionSheetItem onClick={() => handleClickEditComment(comment)} autoclose before={<Icon28EditOutline />}>
              Редактировать
            </ActionSheetItem>
            <ActionSheetItem
              onClick={() => handleClickDeleteComment(comment, feedbackIndex)}
              autoclose
              before={platform === IOS ? <Icon28DeleteOutline /> : <Icon28DeleteOutlineAndroid />}
              mode="destructive"
            >
              Удалить
            </ActionSheetItem>
          </ActionSheet>
        )
      } else {
        setPopout(
          <ActionSheet
            onClose={() => setPopout(null)}
            iosCloseItem={
              <ActionSheetItem autoclose mode="cancel">
                Отменить
              </ActionSheetItem>
            }
          >
            <ActionSheetItem
              onClick={() => {
                handleClickReport(comment)
              }}
              autoclose
              before={<Icon28WarningTriangleOutline />}
            >
              Пожаловаться
            </ActionSheetItem>
          </ActionSheet>
        )
      }
    },
    [Store.User.userID, handleClickDeleteComment, handleClickEditComment, handleClickReport, platform, setPopout]
  )

  const handleClickScreen = useCallback(() => {
    Store.Target.setReply(false)
  }, [Store.Target])

  useEffect(() => {
    Store.Target.getInfo()
    return () => Store.Target.TargetClear()
  }, [Store.Target])

  useEffect(() => {
    //Закрывает WriteBar при клике на другую область
    if (Store.Target.reply) {
      reviewsRef.current.addEventListener('click', handleClickScreen)
    } else {
      reviewsRef.current.removeEventListener('click', handleClickScreen)
    }
  }, [Store.Target.reply, handleClickScreen])

  return (
    <Panel id={id} className="Overflow-custom">
      <PanelHeader left={<PanelHeaderBack onClick={go.back} />}>
        {Store.Target.type === USER ? 'Пользователь' : 'Сообщество'}
      </PanelHeader>
      {snack}
      <Group getRootRef={reviewsRef}>
        {Store.Target.type === USER && (
          <UserGradient user={Store.Target.user} feedbacks={Store.Target.feedbacks} onClickDetails={onClickDetails} />
        )}
        {/* Временно */}
        {Store.Target.type === GROUP && (
          <GroupGradient
            group={Store.Target.group}
            feedbacks={Store.Target.feedbacks}
            onClickDetails={onClickDetails}
          />
        )}
        <Group
          header={
            <Header mode="secondary" indicator={<CounterFeedbacks feedbacks={Store.Target.feedbacks} />}>
              Отзывы
            </Header>
          }
          mode="plain"
          style={Store.Target?.reply ? { marginBottom: '116px' } : {}} // При открытом WriteBar, создается отступ под отзывами
        >
          {!Store.Target?.isReviewed && !Store.Target?.isMyself && (
            <CellButton centered before={<Icon28AddOutline />} onClick={handleClickAddFeedback}>
              Написать отзыв
            </CellButton>
          )}
          {Store.Target.feedbacks.fetching ? (
            <PanelSpinner />
          ) : (
            <>
              {Store.Target.feedbacks?.data?.Feedbacks?.map((feedback, index) => (
                <Group key={feedback?.id}>
                  <Feedback feedback={feedback} onClick={handleClickFeedback} onClickReply={handleClickReply} />
                  <CommentList
                    comments={feedback?.Comments}
                    feedbackIndex={index}
                    onClickComment={handleClickComment}
                    onClickReply={handleClickReply}
                  />
                </Group>
              ))}
            </>
          )}
        </Group>
      </Group>
      {Store.Target?.reply && (
        <Group>
          <CustomWriteBar store={Store.Target} />
        </Group>
      )}
    </Panel>
  )
})

export default TargetPanel
