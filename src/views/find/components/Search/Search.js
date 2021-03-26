import React, { useEffect, useRef } from 'react';
import SearchVKUI from '@vkontakte/vkui/dist/components/Search/Search';

const Search = ({ onFocus, searchSwitch, focus = false, text, setText }) => {
  const textInput = useRef(null);

  useEffect(() => {
    if (focus) {
      textInput.current.focus();
    }
  }, [focus, textInput]);

  return (
    <>
      <SearchVKUI
        getRef={textInput}
        onFocus={onFocus}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
    </>
  );
};

export default Search;
