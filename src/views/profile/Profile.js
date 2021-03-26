import React from 'react';
import { View, Panel, PanelHeader, PanelHeaderBack, Group } from '@vkontakte/vkui';
const Profile = (props) => {
  return (
    <View id="profile" activePanel="profile">
      <Panel id="profile">
        <PanelHeader left={<PanelHeaderBack />}>Профиль</PanelHeader>
        <Group style={{ height: '1000px' }}></Group>
      </Panel>
    </View>
  );
};

export default Profile;
