import React from 'react';
import { Caption, Group, PanelHeader, PanelHeaderBack, Panel } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import DetailsGroup from '../../../store/detailsGroup';

const Details = observer(({ id, go }) => {
  return (
    <Panel id={id}>
      <PanelHeader
        left={
          <PanelHeaderBack
            onClick={() => {
              go('main');
              DetailsGroup.infoClear();
            }}
          />
        }
      >
        Подробности
      </PanelHeader>
      <Group>
        <Caption>{DetailsGroup.info && DetailsGroup.info.first_name}</Caption>
      </Group>
    </Panel>
  );
});

export default Details;
