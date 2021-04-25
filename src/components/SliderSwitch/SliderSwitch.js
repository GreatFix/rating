import _extends from '@babel/runtime/helpers/extends';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _assertThisInitialized from '@babel/runtime/helpers/assertThisInitialized';
import _inherits from '@babel/runtime/helpers/inherits';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import { createScopedElement } from '@vkontakte/vkui/dist/lib/jsxRuntime';
import React, { createRef } from 'react';
import SliderSwitchButton from './SliderSwitchButton';
import { classNames } from '@vkontakte/vkui/dist/lib/classNames';
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === 'function') return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

var SliderSwitch = /*#__PURE__*/ (function (_React$Component) {
  _inherits(SliderSwitch, _React$Component);

  var _super = _createSuper(SliderSwitch);

  function SliderSwitch(props) {
    var _props$activeValue;

    var _this;

    _classCallCheck(this, SliderSwitch);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), 'firstButton', void 0);

    _defineProperty(_assertThisInitialized(_this), 'secondButton', void 0);

    _defineProperty(_assertThisInitialized(_this), 'onSwitch', function (value) {
      var onSwitch = _this.props.onSwitch;

      _this.setState(function () {
        return {
          activeValue: value,
        }; //Изменение
      });
      onSwitch && onSwitch(value); //Изменение
    });

    _defineProperty(_assertThisInitialized(_this), 'handleFirstClick', function () {
      var options = _this.props.options;
      var value = options[0].value === _this.props.activeValue ? 0 : options[0].value; //Изменение
      _this.onSwitch(value);
    });

    _defineProperty(_assertThisInitialized(_this), 'handleSecondClick', function () {
      var options = _this.props.options;
      var value = options[1].value === _this.props.activeValue ? 0 : options[1].value; //Изменение
      _this.onSwitch(value);
    });

    _defineProperty(_assertThisInitialized(_this), 'handleFirstHover', function () {
      _this.setState(function () {
        return {
          hoveredOptionId: 0,
        };
      });
    });

    _defineProperty(_assertThisInitialized(_this), 'handleSecondHover', function () {
      _this.setState(function () {
        return {
          hoveredOptionId: 1,
        };
      });
    });

    _defineProperty(_assertThisInitialized(_this), 'resetFocusedOption', function () {
      _this.setState(function () {
        return {
          hoveredOptionId: -1,
        };
      });
    });

    _defineProperty(_assertThisInitialized(_this), 'switchByKey', function (event) {
      if (event.key !== 'Enter' && event.key !== 'Spacebar' && event.key !== ' ') {
        return;
      }

      event.preventDefault();
      var options = _this.props.options;
      var activeValue = _this.state.activeValue;

      var _options$find = options.find(function (option) {
          return option.value !== activeValue;
        }),
        value = _options$find.value;

      _this.onSwitch(value);

      if (options[0].value === value) {
        _this.firstButton.current.focus();
      } else {
        _this.secondButton.current.focus();
      }
    });

    _this.state = {
      activeValue:
        (_props$activeValue = props.activeValue) !== null && _props$activeValue !== void 0
          ? _props$activeValue
          : '',
      hoveredOptionId: -1,
    };
    _this.firstButton = /*#__PURE__*/ createRef();
    _this.secondButton = /*#__PURE__*/ createRef();
    return _this;
  }

  _createClass(
    SliderSwitch,
    [
      {
        key: 'render',
        value: function render() {
          var _classNames;

          var _this$props = this.props,
            name = _this$props.name,
            options = _this$props.options,
            // eslint-disable-next-line no-unused-vars
            _activeValue = _this$props.activeValue,
            // eslint-disable-next-line no-unused-vars
            onSwitch = _this$props.onSwitch,
            restProps = _objectWithoutProperties(_this$props, [
              'name',
              'options',
              'activeValue',
              'onSwitch',
            ]);

          var _this$state = this.state,
            // eslint-disable-next-line no-unused-vars
            activeValue = _this$state.activeValue,
            hoveredOptionId = _this$state.hoveredOptionId;

          var _options = _slicedToArray(options, 2),
            firstOption = _options[0],
            secondOption = _options[1];

          var firstActive = firstOption.value === _activeValue; //Изменение
          var secondActive = secondOption.value === _activeValue; //Изменение
          return createScopedElement(
            'div',
            _extends({}, restProps, {
              vkuiClass: 'SliderSwitch',
              onKeyDown: this.switchByKey,
              onMouseLeave: this.resetFocusedOption,
            }),
            !firstActive &&
              !secondActive &&
              createScopedElement('div', {
                vkuiClass: 'SliderSwitch__border',
              }),
            createScopedElement('div', {
              vkuiClass: classNames(
                'SliderSwitch__slider',
                ((_classNames = {}),
                _defineProperty(_classNames, 'SliderSwitch--firstActive', firstActive),
                _defineProperty(_classNames, 'SliderSwitch--secondActive', secondActive),
                _classNames)
              ),
            }),
            createScopedElement('input', {
              type: 'hidden',
              name: name,
              value: _activeValue, //Изменение
            }),
            createScopedElement(
              SliderSwitchButton,
              {
                active: firstActive,
                hovered: hoveredOptionId === 0,
                'aria-pressed': firstActive,
                onClick: this.handleFirstClick,
                onMouseEnter: this.handleFirstHover,
                getRootRef: this.firstButton,
              },
              firstOption.name
            ),
            createScopedElement(
              SliderSwitchButton,
              {
                active: secondActive,
                hovered: hoveredOptionId === 1,
                onClick: this.handleSecondClick,
                onMouseEnter: this.handleSecondHover,
                getRootRef: this.secondButton,
              },
              secondOption.name
            )
          );
        },
      },
    ],
    [
      {
        key: 'getDerivedStateFromProps',
        value: function getDerivedStateFromProps(nextProps, prevState) {
          if (nextProps.activeValue && nextProps.activeValue !== prevState.activeValue) {
            return {
              activeValue: nextProps.activeValue,
            };
          }

          return null;
        },
      },
    ]
  );

  return SliderSwitch;
})(React.Component);

_defineProperty(SliderSwitch, 'defaultProps', {
  options: [
    {
      name: '',
      value: '',
    },
    {
      name: '',
      value: '',
    },
  ],
});

export { SliderSwitch as default };
//# sourceMappingURL=SliderSwitch.js.map
