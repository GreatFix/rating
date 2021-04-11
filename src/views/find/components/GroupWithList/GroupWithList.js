import React from 'react';
import { Group, Placeholder, PanelSpinner } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';

import CustomList from '../CustomList/CustomList';
const GroupWithList = observer(({ object, altHeader, icon, cellType, onClick }) => (
  <Group>
    {object.fetching && object.list.length === 0 ? (
      <PanelSpinner />
    ) : object.list.length > 0 ? (
      <CustomList array={object.list} onClick={onClick} cellType={cellType} />
    ) : (
      <Placeholder header={altHeader} icon={icon}>
        Не найдено
      </Placeholder>
    )}
  </Group>
));

export default GroupWithList;
