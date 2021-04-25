import React, { useEffect, useContext, useState, useCallback } from 'react'
import {
  Panel,
  PanelHeader,
  Group,
  Avatar,
  Gradient,
  Tabs,
  Title,
  Text,
  Spinner,
  PanelSpinner,
  TabsItem,
  Placeholder,
  MiniInfoCell,
} from '@vkontakte/vkui'
import { Icon56MessagesOutline, Icon24CommentOutline, Icon20Info } from '@vkontakte/icons'
import Popular from '../components/Popular/Popular'
import CustomList from '../components/CustomList/CustomList'
import BRIDGE_API from '../API/bridge'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../store/store'

const TAB_FEEDBACKS = 'TAB_FEEDBACKS'
const TAB_COMMENTS = 'TAB_COMMENTS'
const PANEL_ABOUT = 'PANEL_ABOUT'
const PANEL_TARGET = 'PANEL_TARGET'
const HomePanel = observer(({ go, id }) => {
  const Store = useContext(StoreContext)
  const [activeTab, setActiveTab] = useState(TAB_FEEDBACKS)

  const setTabFeedback = useCallback(() => {
    setActiveTab(TAB_FEEDBACKS)
  }, [])
  const setTabComment = useCallback(() => {
    setActiveTab(TAB_COMMENTS)
  }, [])

  const handleClickFeedback = useCallback(
    async (feedback) => {
      await Store.Profile.getTargetOfFeedback(feedback)
      go.forward(PANEL_TARGET)
    },
    [Store.Profile, go]
  )

  const handleClickComment = useCallback(
    async (comment, feedbackId) => {
      await Store.Profile.getTargetOfComment(comment)
      go.forward(PANEL_TARGET)
    },
    [Store.Profile, go]
  )
  const handleClickReply = useCallback(() => {
    BRIDGE_API.TAPTIC_IMPACT('light')
    console.log('Click reply')
  }, [])

  const handleClickMyInfo = useCallback(() => {
    go.forward(PANEL_ABOUT)
  }, [go])

  useEffect(() => {
    Store.Profile.getInfo()
  }, [Store.Profile])

  return (
    <Panel id={id} className="Overflow-custom">
      <PanelHeader>Профиль</PanelHeader>
      <Group>
        <Gradient className="Gradient-custom" mode="white">
          <Avatar size={96} src={Store.Profile.info.data?.photo_100}>
            {Store.Profile.info.fetching && <PanelSpinner />}
          </Avatar>
          <Title className="Title-custom" level="2" weight="medium">
            {Store.Profile.info.fetching || !Store.Profile.title ? <Spinner /> : `${Store.Profile.title}`}
          </Title>
          {Store.Profile.info?.fetching ? (
            <Spinner />
          ) : (
            <Text className="HeaderWithCounter-custom">
              <Popular
                positive={Store.Profile.info?.data?.countPositiveFeedbacks}
                negative={Store.Profile.info?.data?.countNegativeFeedbacks}
                mode="activity"
              />
            </Text>
          )}
          <MiniInfoCell before={<Icon20Info />} mode="more" onClick={handleClickMyInfo}>
            Обо мне
          </MiniInfoCell>
        </Gradient>
      </Group>
      <Tabs>
        <TabsItem onClick={setTabFeedback} selected={activeTab === TAB_FEEDBACKS}>
          Мои отзывы
        </TabsItem>
        <TabsItem onClick={setTabComment} selected={activeTab === TAB_COMMENTS}>
          Мои комментарии
        </TabsItem>
      </Tabs>
      <Group>
        {Store.Profile.info?.fetching ? (
          <Spinner />
        ) : (
          Store.Profile.info?.data && (
            <>
              {activeTab === TAB_FEEDBACKS &&
                (Store.Profile.info.data?.Feedbacks.length > 0 ? (
                  <CustomList
                    array={Store.Profile.info.data?.Feedbacks}
                    onClick={handleClickFeedback}
                    onClickReply={handleClickReply}
                    cellType={'FeedbackCell'}
                  />
                ) : (
                  <Placeholder header={'Отзывы'} icon={<Icon56MessagesOutline />}>
                    Не найдено
                  </Placeholder>
                ))}

              {activeTab === TAB_COMMENTS &&
                (Store.Profile.info.data?.Comments.length > 0 ? (
                  <CustomList
                    array={Store.Profile.info.data?.Comments}
                    onClick={handleClickComment}
                    onClickReply={handleClickReply}
                    cellType={'CommentCell'}
                  />
                ) : (
                  <Placeholder header={'Комментарии'} icon={<Icon24CommentOutline width={56} height={56} />}>
                    Не найдено
                  </Placeholder>
                ))}
            </>
          )
        )}
      </Group>
    </Panel>
  )
})

export default HomePanel
