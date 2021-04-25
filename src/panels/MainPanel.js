import React, { useState, useRef, useEffect, useCallback, useContext } from 'react'
import { Panel, PanelHeader, Tabs, TabsItem, Placeholder, Button, Search } from '@vkontakte/vkui'
import { Icon56UsersOutline, Icon56ErrorTriangleOutline, Icon56Users3Outline } from '@vkontakte/icons'
import GroupWithList from '../components/GroupWithList/GroupWithList'
import BRIDGE_API from '../API/bridge'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../store/store'

const PANEL_SEARCH = 'PANEL_SEARCH'
const PANEL_TARGET = 'PANEL_TARGET'
const TAB_FRIENDS = 'fetchFriends'
const TAB_GROUPS = 'fetchGroups'
const COUNT = 20

const MainPanel = observer(({ id, go }) => {
  const Store = useContext(StoreContext)
  const [activeTab, setActiveTab] = useState(TAB_FRIENDS)
  const offset = useRef(0)
  const scrollHeight = useRef(0)
  const onScroll = useCallback(
    (e) => {
      if (
        e.target.offsetHeight + e.target.scrollTop + 10 >= e.target.scrollHeight &&
        scrollHeight.current !== e.target.scrollHeight
      ) {
        scrollHeight.current = e.target.scrollHeight
        offset.current = offset.current + COUNT
        Store.Find[activeTab](offset.current)
      }
    },
    [Store.Find, activeTab]
  )

  const setTabFriends = useCallback((group) => {
    setActiveTab(TAB_FRIENDS)
  }, [])

  const setTabGroups = useCallback((group) => {
    setActiveTab(TAB_GROUPS)
  }, [])

  const onClickTarget = useCallback(
    (target, type) => {
      Store.Target.setId(target.id)
      Store.Target.setType(type)
      go.forward(PANEL_TARGET)
    },
    [Store.Target, go]
  )

  const goSearchPanel = useCallback(() => {
    go.forward(PANEL_SEARCH)
  }, [go])

  useEffect(() => {
    offset.current = 0
    Store.Find[activeTab]()
  }, [Store.Find, activeTab, Store.User.access_token])

  useEffect(() => () => Store.Find.clearFetchedInfo(), [Store.Find])

  useEffect(() => {
    BRIDGE_API.ENABLE_SWIPE()

    return () => BRIDGE_API.DISABLE_SWIPE()
  }, [])

  return (
    <Panel id={id} onScroll={onScroll} className="Overflow-custom">
      <PanelHeader>Найти</PanelHeader>
      <Search onFocus={goSearchPanel} />
      <Tabs>
        <TabsItem onClick={setTabFriends} selected={activeTab === TAB_FRIENDS}>
          Друзья
        </TabsItem>
        <TabsItem onClick={setTabGroups} selected={activeTab === TAB_GROUPS}>
          Сообщества
        </TabsItem>
      </Tabs>
      {activeTab === TAB_FRIENDS && Store.User?.permissions?.includes('friends') ? (
        <GroupWithList
          object={Store.Find.friends}
          altHeader={'Друзья'}
          icon={<Icon56UsersOutline />}
          onClick={onClickTarget}
          cellType={'UserCell'}
        />
      ) : activeTab === TAB_GROUPS && Store.User?.permissions?.includes('groups') ? (
        <GroupWithList
          object={Store.Find.groups}
          altHeader={'Сообщества'}
          icon={<Icon56Users3Outline />}
          onClick={onClickTarget}
          cellType={'GroupCell'}
        />
      ) : (
        <Placeholder
          icon={<Icon56ErrorTriangleOutline />}
          action={
            <Button onClick={() => Store.User.getUserToken('friends,groups')} size="m">
              Дать разрешение
            </Button>
          }
        >
          Нет доступа к этому разделу
        </Placeholder>
      )}
    </Panel>
  )
})

export default MainPanel
