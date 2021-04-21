import React, { useCallback, useEffect, useState, useContext, useRef, useMemo } from 'react';
import {
  View,
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  PanelHeaderClose,
  Group,
  Placeholder,
  SimpleCell,
  FormItem,
  SizeType,
  Search,
  List,
  SelectMimicry,
  PanelHeaderButton,
  Button,
  usePlatform,
} from '@vkontakte/vkui';
import { Icon24HomeOutline, Icon28RefreshOutline, Icon16Globe } from '@vkontakte/icons';
import { observer } from 'mobx-react-lite';
import MainPanel from './panels/MainPanel/MainPanel';
import TargetPanel from './panels/TargetPanel/TargetPanel';
import FeedbackPanel from './panels/FeedbackPanel/FeedbackPanel';
import CommentPanel from './panels/CommentPanel/CommentPanel';
import SearchPanel from './panels/SearchPanel/SearchPanel';
import Slider from './components/Slider/Slider';

import CustomModalHeader from './components/CustomModalHeader/CustomModalHeader';
import CustomSliderSwitch from './components/SliderSwitch/SliderSwitch';
import { StoreContext } from '../../store/store';
import Details from './components/Details/Details';
import History from '../../utils/history';

const PANEL_TARGET = 'PANEL_TARGET';
const PANEL_MAIN = 'PANEL_MAIN';
const PANEL_SEARCH = 'PANEL_SEARCH';
const PANEL_FEEDBACK = 'PANEL_FEEDBACK';
const PANEL_COMMENT = 'PANEL_COMMENT';

const MODAL_PAGE_FILTERS = 'MODAL_PAGE_FILTERS';
const MODAL_PAGE_SELECT_COUNTRY = 'MODAL_PAGE_SELECT_COUNTRY';
const MODAL_PAGE_SELECT_CITY = 'MODAL_PAGE_SELECT_CITY';
const MODAL_PAGE_DETAILS = 'MODAL_PAGE_DETAILS';

const Find = observer(({ id }) => {
  const Store = useContext(StoreContext);
  const platform = usePlatform();
  const [activePanel, setActivePanel] = useState(PANEL_MAIN);
  const [activeModal, setActiveModal] = useState(null);
  const [popout, setPopout] = useState(null);
  const [text, setText] = useState('');
  const [ageSlider, setAgeSlider] = useState({ age_from: 14, age_to: 80 });
  const debouncedSetAge = useRef();

  const forward = useCallback((prev, next) => {
    setActivePanel(next);
    History.add(prev);
  }, []);

  const back = useCallback(() => {
    setActivePanel(History.back());
  }, []);

  useEffect(() => {
    Store.Filters.country.id && Store.Filters.getCities(text);
  }, [Store.Filters, text]);

  const onCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const onActiveModalFilters = useCallback(() => {
    setActiveModal(MODAL_PAGE_FILTERS);
  }, []);

  const onActiveModalSelectCountry = useCallback(() => {
    setActiveModal(MODAL_PAGE_SELECT_COUNTRY);
  }, []);

  const onActiveModalSelectCity = useCallback(() => {
    Store.Filters.country.id && setActiveModal(MODAL_PAGE_SELECT_CITY);
  }, [Store.Filters.country]);

  const onActiveModalDetails = useCallback(() => {
    setActiveModal(MODAL_PAGE_DETAILS);
  }, []);

  const onClickCountry = useCallback(
    (country) => {
      Store.Filters.setCountry(country);
      Store.Filters.getCities();
      setActiveModal(MODAL_PAGE_FILTERS);
    },
    [Store.Filters]
  );

  const onClickCity = useCallback(
    (city) => {
      Store.Filters.setCity(city);
      setText('');
      setActiveModal(MODAL_PAGE_FILTERS);
    },
    [Store.Filters]
  );

  const onSwitchSex = useCallback(
    (value) => {
      Store.Filters.setSex(value);
    },
    [Store.Filters]
  );

  const onClickFilters = useCallback(() => {
    onActiveModalFilters();
    Store.Filters.listCountries.length === 0 && Store.Filters.getCountries();
  }, [Store.Filters, onActiveModalFilters]);

  const onRefreshFilters = useCallback(() => {
    Store.Filters.filterClear();
  }, [Store.Filters]);

  const onChangeSliderAge = useCallback(
    (value) => {
      if (debouncedSetAge.current) clearTimeout(debouncedSetAge.current);
      debouncedSetAge.current = setTimeout(() => {
        Store.Filters.setAge_from(value[0]);
        Store.Filters.setAge_to(value[1]);
      }, 250);
      setAgeSlider({ age_from: value[0], age_to: value[1] });
    },
    [Store.Filters]
  );

  const modal = (
    <ModalRoot activeModal={activeModal}>
      <ModalPage
        className="Overflow"
        id={MODAL_PAGE_FILTERS}
        onClose={onCloseModal}
        header={
          <ModalPageHeader
            left={<PanelHeaderClose onClick={onCloseModal} />}
            right={
              <PanelHeaderButton>
                <Icon28RefreshOutline onClick={onRefreshFilters} />
              </PanelHeaderButton>
            }
          >
            Фильтры
          </ModalPageHeader>
        }
      >
        <Group>
          <FormItem top="Страна" onClick={onActiveModalSelectCountry}>
            <SelectMimicry sizeY={SizeType.COMPACT} placeholder="Не выбрана">
              {Store.Filters?.country?.title}
            </SelectMimicry>
          </FormItem>
          <FormItem top="Город" onClick={onActiveModalSelectCity}>
            <SelectMimicry sizeY={SizeType.COMPACT} placeholder="Не выбран" disabled={!Store.Filters.country.id}>
              {Store.Filters?.city?.title}
            </SelectMimicry>
          </FormItem>
          <FormItem>
            <CustomSliderSwitch
              activeValue={Store.Filters.sex}
              options={[
                {
                  name: 'Женский',
                  value: 1,
                },
                {
                  name: 'Мужской',
                  value: 2,
                },
              ]}
              onSwitch={onSwitchSex}
            />
          </FormItem>
          <FormItem top="Возраст">
            <Slider
              min={14}
              max={80}
              step={1}
              age_from={ageSlider.age_from}
              age_to={ageSlider.age_to}
              onChange={onChangeSliderAge}
            />
          </FormItem>
          <FormItem>
            <Button size="l" stretched mode="outline" onClick={onCloseModal}>
              Показать результаты
            </Button>
          </FormItem>
        </Group>
      </ModalPage>
      <ModalPage
        id={MODAL_PAGE_SELECT_COUNTRY}
        className="Overflow"
        onClose={onActiveModalFilters}
        header={
          <CustomModalHeader onCloseClick={onActiveModalFilters} platform={platform}>
            Выбор страны
          </CustomModalHeader>
        }
      >
        <Group>
          <List>
            {Store.Filters.listCountries?.length > 0 ? (
              Store.Filters.listCountries?.map((country) => (
                <SimpleCell key={country.id} onClick={() => onClickCountry(country)}>
                  {country.title}
                </SimpleCell>
              ))
            ) : (
              <Placeholder icon={<Icon16Globe width={56} height={56} />}>Страны</Placeholder>
            )}
          </List>
        </Group>
      </ModalPage>
      <ModalPage
        id={MODAL_PAGE_SELECT_CITY}
        onClose={onActiveModalFilters}
        header={
          <CustomModalHeader onCloseClick={onActiveModalFilters} platform={platform}>
            Выбор города
          </CustomModalHeader>
        }
        className="Overflow"
      >
        <Group>
          <Search value={text} onChange={(e) => setText(e.target.value)} />
          <List>
            {Store.Filters.listCities.length > 0 ? (
              Store.Filters.listCities.map((city) => (
                <SimpleCell key={city.id} onClick={() => onClickCity(city)}>
                  {city.title}
                </SimpleCell>
              ))
            ) : (
              <Placeholder icon={<Icon24HomeOutline width={56} height={56} />}>Города</Placeholder>
            )}
          </List>
        </Group>
      </ModalPage>
      <ModalPage
        id={MODAL_PAGE_DETAILS}
        className="Overflow"
        onClose={onCloseModal}
        header={
          <CustomModalHeader onCloseClick={onCloseModal} platform={platform}>
            Подробнее
          </CustomModalHeader>
        }
      >
        <Details user={Store.Target.user} />
      </ModalPage>
    </ModalRoot>
  );
  const go = useMemo(() => ({ forward, back }), [back, forward]);
  return (
    <View id={id} activePanel={activePanel} modal={modal} popout={popout}>
      <MainPanel id={PANEL_MAIN} go={go} />
      <TargetPanel id={PANEL_TARGET} go={go} onClickDetails={onActiveModalDetails} setPopout={setPopout} />
      <SearchPanel id={PANEL_SEARCH} go={go} onClickFilters={onClickFilters} />
      <FeedbackPanel id={PANEL_FEEDBACK} go={go} />
      <CommentPanel id={PANEL_COMMENT} go={go} />
    </View>
  );
});

export default Find;
