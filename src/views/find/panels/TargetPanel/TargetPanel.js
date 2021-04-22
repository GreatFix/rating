import React, { useCallback, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import {
  Avatar,
  CellButton,
  Gradient,
  Group,
  Header,
  MiniInfoCell,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Title,
  Text,
  Spinner,
  PanelSpinner,
  PopoutWrapper,
  Gallery,
  ActionSheet,
  ActionSheetItem,
  IOS,
  usePlatform,
} from '@vkontakte/vkui'
import {
  Icon20Info,
  Icon28AddOutline,
  Icon24UserAddOutline,
  Icon24UserAddedOutline,
  Icon28DeleteOutline,
  Icon28DeleteOutlineAndroid,
  Icon28EditOutline,
} from '@vkontakte/icons'
import { StoreContext } from '../../../../store/store'
import classes from './TargetPanel.module.css'
import Popular from '../../components/Popular/Popular'
import Feedback from '../../components/Feedback/Feedback'
import CommentList from '../../components/CommentList/CommentList'
import CustomWriteBar from '../../components/CustomWriteBar/CustomWriteBar'

const PANEL_TARGET = 'PANEL_TARGET'
const PANEL_FEEDBACK = 'PANEL_FEEDBACK'
const PANEL_COMMENT = 'PANEL_COMMENT'
const CREATE_FEEDBACK = 'createFeedback'
const UPDATE_FEEDBACK = 'updateFeedback'
const UPDATE_COMMENT = 'updateComment'

const TargetPanel = observer(({ id, go, onClickDetails, setPopout }) => {
  const Store = useContext(StoreContext)
  const platform = usePlatform()

  const handleClickFeedbackImage = useCallback(
    (feedbackIndex, imageIndex) => {
      setPopout(
        <PopoutWrapper alignY="center" alignX="center" onClick={() => setPopout(null)}>
          <Gallery
            className={classes.Gallery}
            slideWidth="100vw"
            align="center"
            bullets="light"
            style={{ height: 'auto' }}
            initialSlideIndex={imageIndex}
          >
            {Store.Target.feedbacks?.data?.Feedbacks[feedbackIndex]?.images?.map((src, index) => (
              <img key={index} className={classes.PopoutImage} src={src.MaxSize.url} alt="Slider img" />
            ))}
          </Gallery>
        </PopoutWrapper>
      )
    },
    [Store.Target.feedbacks?.data?.Feedbacks, setPopout]
  )

  const handleClickAddFeedback = useCallback(() => {
    go.forward(PANEL_TARGET, PANEL_FEEDBACK)
    Store.Feedback.init({ type: CREATE_FEEDBACK })
  }, [Store.Feedback, go])

  const handleClickEditFeedback = useCallback(
    (id) => {
      go.forward(PANEL_TARGET, PANEL_FEEDBACK)
      const feedback = Store.Target.feedbacks?.data?.Feedbacks?.find((feedback) => feedback.id === id)
      Store.Feedback.init({
        type: UPDATE_FEEDBACK,
        conclusion: feedback.conclusion,
        images: feedback.images,
        content: feedback.content,
        feedbackID: id,
      })
    },
    [Store.Feedback, Store.Target.feedbacks?.data?.Feedbacks, go]
  )

  const handleClickDeleteFeedback = useCallback(
    async (id) => {
      try {
        const result = await Store.Feedback.deleteFeedback(id)
        if (result) Store.Target.popFeedback(id)
      } catch (err) {
        console.error(err)
      }
    },
    [Store.Feedback, Store.Target]
  )

  const handleClickFeedback = useCallback(
    (id) => {
      setPopout(
        <ActionSheet
          onClose={() => setPopout(null)}
          iosCloseItem={
            <ActionSheetItem autoclose mode="cancel">
              Отменить
            </ActionSheetItem>
          }
        >
          <ActionSheetItem onClick={() => handleClickEditFeedback(id)} autoclose before={<Icon28EditOutline />}>
            Редактировать
          </ActionSheetItem>
          <ActionSheetItem
            onClick={() => handleClickDeleteFeedback(id)}
            autoclose
            before={platform === IOS ? <Icon28DeleteOutline /> : <Icon28DeleteOutlineAndroid />}
            mode="destructive"
          >
            Удалить
          </ActionSheetItem>
        </ActionSheet>
      )
    },
    [handleClickDeleteFeedback, handleClickEditFeedback, platform, setPopout]
  )

  const handleClickCommentImage = useCallback(
    (feedbackIndex, commentIndex, imageIndex) => {
      setPopout(
        <PopoutWrapper alignY="center" alignX="center" onClick={() => setPopout(null)}>
          <Gallery
            className={classes.Gallery}
            slideWidth="100vw"
            align="center"
            bullets="light"
            style={{ height: 'auto' }}
            initialSlideIndex={imageIndex}
          >
            {Store.Target.feedbacks.data?.Feedbacks[feedbackIndex]?.Comments[commentIndex]?.images?.map(
              (src, index) => (
                <img key={index} className={classes.PopoutImage} src={src.MaxSize.url} alt="Slider img" />
              )
            )}
          </Gallery>
        </PopoutWrapper>
      )
    },
    [Store.Target.feedbacks.data?.Feedbacks, setPopout]
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
    (id, feedbackIndex) => {
      go.forward(PANEL_TARGET, PANEL_COMMENT)
      const comment = Store.Target.feedbacks?.data?.Feedbacks[feedbackIndex]?.Comments?.find(
        (comment) => comment.id === id
      )
      Store.Comment.init({
        type: UPDATE_COMMENT,
        images: comment.images,
        content: comment.content,
        commentID: id,
      })
    },
    [Store.Comment, Store.Target.feedbacks?.data?.Feedbacks, go]
  )

  const handleClickDeleteComment = useCallback(
    async (id, feedbackIndex) => {
      try {
        const result = await Store.Comment.deleteComment(id)
        if (result) Store.Target.popComment(id, feedbackIndex)
      } catch (err) {
        console.error(err)
      }
    },
    [Store.Comment, Store.Target]
  )

  const handleClickComment = useCallback(
    (id, feedbackIndex) => {
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
            onClick={() => handleClickEditComment(id, feedbackIndex)}
            autoclose
            before={<Icon28EditOutline />}
          >
            Редактировать
          </ActionSheetItem>
          <ActionSheetItem
            onClick={() => handleClickDeleteComment(id, feedbackIndex)}
            autoclose
            before={platform === IOS ? <Icon28DeleteOutline /> : <Icon28DeleteOutlineAndroid />}
            mode="destructive"
          >
            Удалить
          </ActionSheetItem>
        </ActionSheet>
      )
    },
    [handleClickDeleteComment, handleClickEditComment, platform, setPopout]
  )

  useEffect(() => {
    Store.Target.getInfo()
    return () => Store.Target.TargetClear()
  }, [Store.Target])

  return (
    <Panel id={id} className={'Overflow'}>
      <PanelHeader left={<PanelHeaderBack onClick={go.back} />}>Информация о пользователе</PanelHeader>
      <Group>
        <Gradient className={classes.GradientUser}>
          <Avatar size={96} src={Store.Target.user?.data?.photo_100}>
            {Store.Target.user.fetching && <PanelSpinner />}
          </Avatar>
          <Title className={classes.Title} level="2" weight="medium">
            {Store.Target.user.fetching ? <Spinner /> : Store.Target.title}
            {Store.Target.user.data?.is_friend ? (
              <Icon24UserAddedOutline onClick={() => console.log('added')} fill={'#3f8ae0'} /> //TODO: Реализовать удаление из друзей
            ) : (
              <Icon24UserAddOutline onClick={() => console.log('add')} fill={'#3f8ae0'} /> //TODO: Реализовать добавление в друзья
            )}
          </Title>
          {Store.Target.feedbacks.fetching ? (
            <Spinner />
          ) : (
            <Text className={classes.HeaderWithCounter}>
              <Popular
                positive={Store.Target.feedbacks?.data?.countPositiveFeedbacks}
                negative={Store.Target.feedbacks?.data?.countNegativeFeedbacks}
              />
            </Text>
          )}
          <MiniInfoCell before={<Icon20Info />} mode="more" onClick={onClickDetails}>
            Подробная информация
          </MiniInfoCell>
        </Gradient>

        <Group
          header={<Header mode="secondary">Отзывы</Header>}
          mode="plain"
          style={Store.Target?.reply ? { marginBottom: '116px' } : {}} // При открытом WriteBar, создается отступ под отзывами
        >
          {!Store.Target?.isReviewed && (
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
                  <Feedback
                    feedback={feedback}
                    feedbackIndex={index}
                    onClick={handleClickFeedback}
                    onClickImage={handleClickFeedbackImage}
                    onClickReply={handleClickReply}
                  />
                  <CommentList
                    comments={feedback?.Comments}
                    feedbackIndex={index}
                    onClickComment={handleClickComment}
                    onClickImage={handleClickCommentImage}
                    onClickReply={handleClickReply}
                  />
                </Group>
              ))}
            </>
          )}
        </Group>
        {Store.Target?.reply && <CustomWriteBar comment={Store.Comment} />}
      </Group>
    </Panel>
  )
})

export default TargetPanel
