import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import {
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
  Gradient,
  Avatar,
  Title,
  Spinner,
  Text,
  Snackbar,
  Link,
} from '@vkontakte/vkui'
import {
  Icon28DeleteOutline,
  Icon28DeleteOutlineAndroid,
  Icon28EditOutline,
  Icon28WarningTriangleOutline,
  Icon16Done,
} from '@vkontakte/icons'
import Feedback from '../components/Feedback/Feedback'
import CommentList from '../components/CommentList/CommentList'
import CustomWriteBar from '../components/CustomWriteBar/CustomWriteBar'
import Popular from '../components/Popular/Popular'
import CounterFeedbacks from '../components/CounterFeedbacks/CounterFeedbacks'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../store/store'

const PANEL_COMMENT = 'PANEL_COMMENT'
const UPDATE_COMMENT = 'updateComment'

const AboutPanel = observer(({ id, go, setPopout }) => {
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

  const handleClickFeedback = useCallback(
    (feedback) => {
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
    },
    [handleClickReport, setPopout]
  )

  const handleClickReply = useCallback(
    (feedbackId, greetingName, greetingID) => {
      Store.Comment.init({
        feedbackId,
        greetingName,
        greetingID,
        content: `${greetingName}, `,
      })
      Store.Profile.setReply(true)
    },
    [Store.Comment, Store.Profile]
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
        if (result) Store.Profile.popComment(feedback.id, feedbackIndex)
      } catch (err) {
        console.error(err)
      }
    },
    [Store.Comment, Store.Profile]
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
    Store.Profile.setReply(false)
  }, [Store.Profile])

  useEffect(() => {
    Store.Profile.getAbout()
  }, [Store.Profile])

  useEffect(() => {
    //Закрывает WriteBar при клике на другую область
    if (Store.Profile.reply) {
      reviewsRef.current.addEventListener('click', handleClickScreen)
    } else {
      reviewsRef.current.removeEventListener('click', handleClickScreen)
    }
  }, [Store.Profile.reply, handleClickScreen])

  return (
    <Panel id={id} className="Overflow-custom">
      <PanelHeader left={<PanelHeaderBack onClick={go.back} />}>Обо мне</PanelHeader>
      {snack}
      <Group getRootRef={reviewsRef}>
        <Group>
          <Gradient className="Gradient-custom" mode="white">
            <Avatar size={96} src={Store.Profile.info.data?.photo_100}>
              {Store.Profile.info.fetching && <PanelSpinner />}
            </Avatar>
            <Title className="Title-custom" level="2" weight="medium">
              {Store.Profile.info.fetching || !Store.Profile.title ? (
                <Spinner />
              ) : (
                <Link target={'_blank'} href={`https://vk.com/id${Store.Profile.info.data?.id}`} rel="noreferrer">
                  {Store.Profile.title}
                </Link>
              )}
            </Title>
            {Store.Profile.info?.fetching ? (
              <Spinner />
            ) : (
              <Text className="HeaderWithCounter-custom">
                <Popular
                  positive={Store.Profile.about?.data?.countPositiveFeedbacks}
                  negative={Store.Profile.about?.data?.countNegativeFeedbacks}
                />
              </Text>
            )}
          </Gradient>
        </Group>

        <Group
          header={
            <Header mode="secondary" indicator={<CounterFeedbacks feedbacks={Store.Profile.about} />}>
              Отзывы
            </Header>
          }
          mode="plain"
          style={Store.Target?.reply ? { marginBottom: '116px' } : {}} // При открытом WriteBar, создается отступ под отзывами
        >
          {Store.Profile.about.fetching ? (
            <PanelSpinner />
          ) : (
            <>
              {Store.Profile.about?.data?.Feedbacks?.map((feedback, index) => (
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
      {Store.Profile?.reply && (
        <Group>
          <CustomWriteBar store={Store.Profile} />
        </Group>
      )}
    </Panel>
  )
})

export default AboutPanel
