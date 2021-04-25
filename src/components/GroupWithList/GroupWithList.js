import React from 'react'
import { Group, Placeholder, PanelSpinner } from '@vkontakte/vkui'
import CustomList from '../CustomList/CustomList'
import { observer } from 'mobx-react-lite'

const GroupWithList = observer(({ object, altHeader, icon, cellType, onClick, onClickReply, mode }) => (
  <Group>
    {object.list.length > 0 ? (
      <CustomList array={object.list} onClick={onClick} cellType={cellType} mode={mode} onClickReply={onClickReply} />
    ) : (
      <Placeholder header={altHeader} icon={icon}>
        Не найдено
      </Placeholder>
    )}
    {object.fetching && <PanelSpinner />}
  </Group>
))

export default GroupWithList
