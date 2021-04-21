import React from 'react';
import { ModalPageHeader, PanelHeaderButton, VKCOM, IOS, ANDROID } from '@vkontakte/vkui';
import { Icon24Cancel, Icon24Dismiss } from '@vkontakte/icons';
const CustomModalHeader = (props) => (
  <ModalPageHeader
    left={
      (props.platform === ANDROID || props.platform === VKCOM) && (
        <PanelHeaderButton onClick={props.onCloseClick}>
          <Icon24Cancel />
        </PanelHeaderButton>
      )
    }
    right={
      props.platform === IOS && (
        <PanelHeaderButton onClick={props.onCloseClick}>
          <Icon24Dismiss />
        </PanelHeaderButton>
      )
    }
  >
    {props.children}
  </ModalPageHeader>
);

export default React.memo(CustomModalHeader);
