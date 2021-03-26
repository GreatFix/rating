import React, { useState } from 'react';
import { View } from '@vkontakte/vkui';
import Main from './panels/Main';
import DetailsUser from './panels/DetailsUser';
import DetailsGroup from './panels/DetailsGroup';
import SearchPanel from './panels/SearchPanel';
import { observer } from 'mobx-react-lite';

const Find = observer((props) => {
  const [activePanel, setActivePanel] = useState('main');

  const go = (panelName) => setActivePanel(panelName);

  const onScroll = (e) => {
    console.log(e.target.offsetHeight);
  };

  return (
    <View id="find" activePanel={activePanel} onScroll={onScroll}>
      <Main id="main" go={go} />
      <DetailsUser id="detailsUser" go={go} />
      <DetailsGroup id="detailsGroup" go={go} />
      <SearchPanel id="searchPanel" go={go} />
    </View>
  );
});

export default Find;
