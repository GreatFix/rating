import React, { useState, useEffect, useRef, useCallback, useContext } from 'react'
import { Panel, PanelHeader, PanelHeaderBack, Placeholder, Search, Tabs, TabsItem } from '@vkontakte/vkui'
import { Icon56UsersOutline, Icon56Users3Outline, Icon28SlidersOutline } from '@vkontakte/icons'
import { useDebounce } from 'use-lodash-debounce'
import GroupWithList from '../components/GroupWithList/GroupWithList'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../store/store'

const PANEL_TARGET = 'PANEL_TARGET'

const TAB_USERS = 'searchUsers'
const TAB_GROUPS = 'searchGroups'
const COUNT = 20

const SearchPanel = observer(({ id, go, onClickFilters }) => {
  const Store = useContext(StoreContext)
  const [activeTab, setActiveTab] = useState(TAB_USERS)
  const offset = useRef(0)
  const scrollHeight = useRef(0)
  const searchRef = useRef(null)

  const [text, setText] = useState('')
  const deferredText = useDebounce(text, 500)

  const onScroll = (e) => {
    if (
      e.target.offsetHeight + e.target.scrollTop + 10 >= e.target.scrollHeight &&
      scrollHeight.current !== e.target.scrollHeight
    ) {
      scrollHeight.current = e.target.scrollHeight
      offset.current = offset.current + COUNT
      Store.Find[activeTab](deferredText, Store.Filters, offset.current)
    }
  }

  const setTabUsers = useCallback(() => {
    setActiveTab(TAB_USERS)
  }, [])

  const setTabGroups = useCallback(() => {
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

  useEffect(() => {
    offset.current = 0
    Store.Find[activeTab](deferredText, Store.Filters)
  }, [
    Store.Find,
    deferredText,
    Store.Filters.country,
    Store.Filters.city,
    Store.Filters.sex,
    Store.Filters.age_from,
    Store.Filters.age_to,
    Store.Filters,
    activeTab,
    Store.User.access_token,
  ])

  useEffect(() => {
    searchRef.current.focus()
  }, [])

  return (
    <Panel id={id} className="Overflow-custom" onScroll={onScroll}>
      <PanelHeader left={<PanelHeaderBack onClick={go.back} />}>??????????</PanelHeader>
      <Search
        getRef={searchRef}
        value={text}
        onChange={(e) => {
          if (
            (Store.Find.searchedUsers.fetching && Store.Find.searchedUsers.list.length === 0) ||
            (Store.Find.searchedGroups.fetching && Store.Find.searchedGroups.list.length === 0)
          )
            return
          setText(e.target.value)
        }}
        icon={activeTab === TAB_USERS && <Icon28SlidersOutline width={24} height={24} />}
        onIconClick={activeTab === TAB_USERS && onClickFilters}
      />
      <Tabs>
        <TabsItem onClick={setTabUsers} selected={activeTab === TAB_USERS}>
          ????????
        </TabsItem>
        <TabsItem onClick={setTabGroups} selected={activeTab === TAB_GROUPS}>
          ????????????????????
        </TabsItem>
      </Tabs>
      {activeTab === TAB_USERS ? (
        <GroupWithList
          object={Store.Find.searchedUsers}
          altHeader={'????????'}
          icon={<Icon56UsersOutline />}
          onClick={onClickTarget}
          cellType={'UserCell'}
        />
      ) : !deferredText ? (
        <Placeholder header={'????????????????????'} icon={<Icon56Users3Outline />}>
          ?????????????? ???????????????? ?????? ????????????
        </Placeholder>
      ) : (
        <GroupWithList
          object={Store.Find.searchedGroups}
          altHeader={'????????????????????'}
          icon={<Icon56Users3Outline />}
          onClick={onClickTarget}
          cellType={'GroupCell'}
        />
      )}
    </Panel>
  )
})

export default SearchPanel
