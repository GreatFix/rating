import React, { useState } from 'react';
import { View } from '@vkontakte/vkui';
import Main from './panels/Main';
import Details from './panels/Details';
import SearchPanel from './panels/SearchPanel';
import { observer } from 'mobx-react-lite';

const Find = observer((props) => {
  const [activePanel, setActivePanel] = useState('main');

  const go = (panelName) => setActivePanel(panelName);

  return (
    <View id="find" activePanel={activePanel}>
      <Main id="main" go={go} />
      <Details id="details" go={go} />
      <SearchPanel id="searchPanel" go={go} />
    </View>
  );
});

export default Find;
