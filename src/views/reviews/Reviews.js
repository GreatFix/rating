import React from 'react'
import { View, Panel, PanelHeader, PanelHeaderBack, Group } from '@vkontakte/vkui'
const Reviews = (props) => {
  return (
    <View id="reviews" activePanel="reviews">
      <Panel id="reviews">
        <PanelHeader left={<PanelHeaderBack />}>Мои отзывы</PanelHeader>
        <Group style={{ height: '1000px' }}></Group>
      </Panel>
    </View>
  )
}

export default Reviews
