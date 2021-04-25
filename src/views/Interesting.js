import React, { useState, useCallback, useEffect, useContext } from 'react'
import { View } from '@vkontakte/vkui'
import TopPanel from '../panels/TopPanel'
import RecentPanel from '../panels/RecentPanel'
import { StoreContext } from '../store/store'

const PANEL_RECENT = 'RECENT'
const PANEL_TOP = 'TOP'

const Interesting = ({ id }) => {
  const Store = useContext(StoreContext)
  const [activePanel, setActivePanel] = useState(PANEL_RECENT)

  const go = useCallback((panel) => {
    setActivePanel(panel)
  }, [])

  useEffect(() => {
    return () => Store.Interesting.clear()
  }, [Store.Interesting])

  return (
    <View id={id} activePanel={activePanel}>
      <TopPanel id={PANEL_TOP} go={go} />
      <RecentPanel id={PANEL_RECENT} go={go} />
    </View>
  )
}

export default Interesting
