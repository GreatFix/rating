import React, { HTMLAttributes, RefObject } from 'react';
import { HasPlatform } from '@vkontakte/vkui/dist/types';
export interface SliderSwitchOptionInterface {
    name: string;
    value: string | number;
}
export interface SliderSwitchProps extends HTMLAttributes<HTMLDivElement>, HasPlatform {
    options: Array<{
        name: string;
        value: string | number;
    }>;
    activeValue?: SliderSwitchOptionInterface['value'];
    name?: string;
    onSwitch?: (value: SliderSwitchOptionInterface['value']) => void;
}
interface SliderSwitchState {
    activeValue: SliderSwitchOptionInterface['value'];
    hoveredOptionId: number;
}
export default class SliderSwitch extends React.Component<SliderSwitchProps, SliderSwitchState> {
    constructor(props: SliderSwitchProps);
    static defaultProps: {
        options: {
            name: string;
            value: string;
        }[];
    };
    firstButton: RefObject<HTMLDivElement>;
    secondButton: RefObject<HTMLDivElement>;
    onSwitch: (value: string | number) => void;
    handleFirstClick: () => void;
    handleSecondClick: () => void;
    handleFirstHover: () => void;
    handleSecondHover: () => void;
    resetFocusedOption: () => void;
    switchByKey: (event: React.KeyboardEvent<Element>) => void;
    static getDerivedStateFromProps(nextProps: SliderSwitchProps, prevState: SliderSwitchState): {
        activeValue: string | number;
    };
    render(): JSX.Element;
}
export {};
