import React, { useCallback, useState } from 'react'
import { Tabs, TabsItem, Panel, PanelHeader, PanelHeaderContext, PanelHeaderContent, List, Cell } from '@vkontakte/vkui'
import { Icon28UsersOutline, Icon24Done, Icon28SettingsOutline, Icon16Dropdown } from '@vkontakte/icons'

import UsersTab from '../tabs/UsersTab'
import TargetsTab from '../tabs/TargetsTab'
import { observer } from 'mobx-react-lite'
const TAB_USERS = 'USERS'
const TAB_TARGETS = 'TARGETS'
const PANEL_RECENT = 'RECENT'

const TopPanel = observer(({ id, go }) => {
  const [activeTab, setActiveTab] = useState(TAB_USERS)
  const [contextOpened, setContextOpened] = useState(false)

  const setTabFeedback = useCallback(() => {
    setActiveTab(TAB_USERS)
  }, [])

  const setTabComment = useCallback(() => {
    setActiveTab(TAB_TARGETS)
  }, [])

  const contextOpen = useCallback(() => {
    setContextOpened(true)
  }, [])

  const contextClose = useCallback(() => {
    setContextOpened(false)
  }, [])

  const handleClickRecentPanel = useCallback(() => {
    go(PANEL_RECENT)
    console.log(PANEL_RECENT)
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
          Топ
        </PanelHeaderContent>
      </PanelHeader>
      <PanelHeaderContext opened={contextOpened} onClose={contextClose}>
        <List>
          <Cell before={<Icon28UsersOutline />} after={<Icon24Done fill="var(--accent)" />}>
            Топ
          </Cell>
          <Cell before={<Icon28SettingsOutline />} onClick={handleClickRecentPanel}>
            Недавние
          </Cell>
        </List>
      </PanelHeaderContext>
      <Tabs>
        <TabsItem onClick={setTabFeedback} selected={activeTab === TAB_USERS}>
          Топ активных
        </TabsItem>
        <TabsItem onClick={setTabComment} selected={activeTab === TAB_TARGETS}>
          Топ популярных
        </TabsItem>
      </Tabs>

      {activeTab === TAB_USERS && <UsersTab />}
      {activeTab === TAB_TARGETS && <TargetsTab />}
    </Panel>
  )
})

export default TopPanel
