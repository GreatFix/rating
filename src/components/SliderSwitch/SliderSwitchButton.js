import _extends from '@babel/runtime/helpers/extends';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import { createScopedElement } from '@vkontakte/vkui/dist/lib/jsxRuntime';
import { useState } from 'react';
import Tappable from '@vkontakte/vkui/dist/components/Tappable/Tappable';
import { getClassName } from '@vkontakte/vkui/dist/helpers/getClassName';
import { classNames } from '@vkontakte/vkui/dist/lib/classNames';
import { usePlatform } from '@vkontakte/vkui/dist/hooks/usePlatform';
import Text from '@vkontakte/vkui/dist/components/Typography/Text/Text';

var SliderSwitchButton = function SliderSwitchButton(props) {
  var _classNames;

  var active = props.active,
    hovered = props.hovered,
    children = props.children,
    getRootRef = props.getRootRef,
    restProps = _objectWithoutProperties(props, ['active', 'hovered', 'children', 'getRootRef']);

  var platform = usePlatform();

  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    focus = _useState2[0],
    setFocus = _useState2[1];

  var toggleFocus = function toggleFocus() {
    setFocus(!focus);
  };

  return createScopedElement(
    Tappable,
    _extends({}, restProps, {
      vkuiClass: classNames(
        getClassName('SliderSwitch__button', platform),
        ((_classNames = {}),
        _defineProperty(_classNames, 'SliderSwitch__button--active', active),
        _defineProperty(_classNames, 'SliderSwitch__button--hover', !active && hovered),
        _defineProperty(_classNames, 'SliderSwitch__button--activeHover', active && hovered),
        _defineProperty(_classNames, 'SliderSwitch__button--focus', focus && !hovered),
        _classNames)
      ),
      Component: 'button',
      getRootRef: getRootRef,
      'aria-pressed': active,
      onFocus: toggleFocus,
      onBlur: toggleFocus,
      tabIndex: 0,
      hasActive: false,
      hoverMode: 'opacity',
    }),
    createScopedElement(
      Text,
      {
        Component: 'span',
        weight: 'medium',
      },
      children
    )
  );
};

export default SliderSwitchButton;
//# sourceMappingURL=SliderSwitchButton.js.map
