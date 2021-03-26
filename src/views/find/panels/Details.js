import React from 'react';

import { Caption, Group, PanelHeader, PanelHeaderBack, Panel } from '@vkontakte/vkui';

import { observer } from 'mobx-react-lite';
import DetailsUser from '../../../store/detailsUser';
import User from '../../../store/user';

const Details = observer(({ id, go }) => {
  return (
    <Panel id={id}>
      <PanelHeader
        left={
          <PanelHeaderBack
            onClick={() => {
              go('main');
              DetailsUser.infoClear();
            }}
          />
        }
      >
        Подробности
      </PanelHeader>
      <Group>
        <Caption>{DetailsUser.info && DetailsUser.info.first_name}</Caption>
      </Group>
    </Panel>
  );
});

export default Details;
