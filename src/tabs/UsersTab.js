import React, { useCallback, useContext, useEffect } from 'react'
import { Icon28UserStarBadgeOutline } from '@vkontakte/icons'
import GroupWithList from '../components/GroupWithList/GroupWithList'
import { observer } from 'mobx-react-lite'
import BRIDGE_API from '../API/bridge'
import { StoreContext } from '../store/store'

const UsersTab = observer((props) => {
  const Store = useContext(StoreContext)

  const handleClickUser = useCallback(() => {
    BRIDGE_API.TAPTIC_IMPACT('light')
  }, [])

  useEffect(() => {
    if (Store.Interesting.users.list.length === 0) Store.Interesting.getTopUsers()
  }, [Store.Interesting])

  return (
    <GroupWithList
      object={Store.Interesting.users}
      altHeader={'Активные пользователи'}
      icon={<Icon28UserStarBadgeOutline width={56} height={56} />}
      onClick={handleClickUser}
      cellType={'UserCell'}
      mode={'activity'}
    />
  )
})

export default UsersTab
