import React, { useCallback, useContext, useEffect } from 'react'
import { Icon24CupOutline } from '@vkontakte/icons'
import GroupWithList from '../components/GroupWithList/GroupWithList'
import { observer } from 'mobx-react-lite'
import BRIDGE_API from '../API/bridge'
import { StoreContext } from '../store/store'

const TargetsTab = observer((props) => {
  const Store = useContext(StoreContext)

  const handleClickTarget = useCallback(() => {
    BRIDGE_API.TAPTIC_IMPACT('light')
  }, [])

  useEffect(() => {
    if (Store.Interesting.targets.list.length === 0) Store.Interesting.getTopTargets()
  }, [Store.Interesting])

  return (
    <GroupWithList
      object={Store.Interesting.targets}
      altHeader={'Рейтинг'}
      icon={<Icon24CupOutline width={56} height={56} />}
      onClick={handleClickTarget}
      cellType={'TargetCell'}
    />
  )
})

export default TargetsTab
