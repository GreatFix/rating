import React, { useCallback, useState } from 'react'
import { Tabs, TabsItem, Panel, PanelHeader, PanelHeaderContext, PanelHeaderContent, List, Cell } from '@vkontakte/vkui'
import { Icon28UsersOutline, Icon24Done, Icon28SettingsOutline, Icon16Dropdown } from '@vkontakte/icons'
import FeedbacksTab from '../tabs/FeedbacksTab'
import CommentsTab from '../tabs/CommentsTab'

const TAB_FEEDBACKS = 'FEEDBACKS'
const TAB_COMMENTS = 'COMMENTS'
const PANEL_TOP = 'TOP'

const RecentPanel = ({ id, go }) => {
  const [activeTab, setActiveTab] = useState(TAB_FEEDBACKS)
  const [contextOpened, setContextOpened] = useState(false)

  const setTabFeedback = useCallback(() => {
    setActiveTab(TAB_FEEDBACKS)
  }, [])
  const setTabComment = useCallback(() => {
    setActiveTab(TAB_COMMENTS)
  }, [])

  const contextOpen = useCallback(() => {
    setContextOpened(true)
  }, [])

  const contextClose = useCallback(() => {
    setContextOpened(false)
  }, [])

  const handleClickTopPanel = useCallback(() => {
    go(PANEL_TOP)
  }, [go])

  return (
    <Panel id={id} className="Overflow-custom">
      <PanelHeader>
        <PanelHeaderContent
          onClick={contextOpen}
          aside={
            <Icon16Dropdown width={24} height={24} style={{ transform: `rotate(${contextOpened ? '180deg' : '0'})` }} />
          }
        >
          Недавние
        </PanelHeaderContent>
      </PanelHeader>
      <PanelHeaderContext opened={contextOpened} onClose={contextClose}>
        <List>
          <Cell before={<Icon28UsersOutline />} onClick={handleClickTopPanel}>
            Топ
          </Cell>
          <Cell before={<Icon28SettingsOutline />} after={<Icon24Done fill="var(--accent)" />}>
            Недавние
          </Cell>
        </List>
      </PanelHeaderContext>
      <Tabs>
        <TabsItem onClick={setTabFeedback} selected={activeTab === TAB_FEEDBACKS}>
          Отзывы
        </TabsItem>
        <TabsItem onClick={setTabComment} selected={activeTab === TAB_COMMENTS}>
          Комментарии
        </TabsItem>
      </Tabs>

      {activeTab === TAB_FEEDBACKS && <FeedbacksTab />}
      {activeTab === TAB_COMMENTS && <CommentsTab />}
    </Panel>
  )
}

export default RecentPanel
