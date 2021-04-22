/* eslint-disable no-unused-vars */
import React, { useContext } from 'react'
import { View, Panel, PanelHeader, PanelHeaderBack, Group } from '@vkontakte/vkui'

import { StoreContext } from '../../store/store'
const Profile = (props) => {
  const Store = useContext(StoreContext)

  return (
    <View id="profile" activePanel="profile">
      <Panel id="profile">
        <PanelHeader left={<PanelHeaderBack />}>Профиль</PanelHeader>
        <Group style={{ height: '1000px' }}></Group>
      </Panel>
    </View>
  )
}

export default Profile
