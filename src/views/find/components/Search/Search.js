import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-lodash-debounce';
import SearchVKUI from '@vkontakte/vkui/dist/components/Search/Search';
import User from '../../../../store/user';
import { observer } from 'mobx-react-lite';

const Search = observer(({ onFocus, searchSwitch, focus = false }) => {
  const [text, setText] = useState('');
  const [filters, setFilters] = useState({});
  const deferredText = useDebounce(text, 500);
  const textInput = useRef(null);

  useEffect(() => {
    if (searchSwitch === 'users') {
      User.searchUsers(deferredText, filters);
    } else if (searchSwitch === 'groups') {
      User.searchGroups(deferredText, filters);
    }
  }, [deferredText, filters, searchSwitch]);

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
});

export default Search;
