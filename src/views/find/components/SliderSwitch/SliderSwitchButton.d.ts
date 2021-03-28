import { FunctionComponent, ButtonHTMLAttributes } from 'react';
import { HasRootRef } from '@vkontakte/vkui/dist/types';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLElement>, HasRootRef<HTMLElement> {
    active?: boolean;
    hovered?: boolean;
}
declare const SliderSwitchButton: FunctionComponent<ButtonProps>;
export default SliderSwitchButton;
