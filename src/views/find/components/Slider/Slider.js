import React, { useCallback, useEffect, useRef } from 'react';
import { RangeSlider } from '@vkontakte/vkui';
import './Slider.css';

const Slider = ({ age_from, age_to, onChange, ...props }) => {
  const startThumbRef = useRef(null);
  const endThumbRef = useRef(null);

  const begoreOnChange = useCallback(
    (value) => {
      startThumbRef.current.innerHTML = value[0];
      endThumbRef.current.innerHTML = value[1];
      onChange(value);
    },
    [onChange]
  );

  useEffect(() => {
    startThumbRef.current = document.querySelector('.ageSlider .vkuiSlider__thumb--start');
    startThumbRef.current.innerHTML = age_from;
    endThumbRef.current = document.querySelector('.ageSlider .vkuiSlider__thumb--end');
    endThumbRef.current.innerHTML = age_to;
  }, [age_from, age_to]);
  return <RangeSlider className="ageSlider" value={[age_from, age_to]} onChange={begoreOnChange} {...props} />;
};

export default Slider;
