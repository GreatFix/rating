import React, { useCallback, useEffect, useState, useContext } from 'react';
import {
  View,
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  PanelHeaderClose,
  PanelHeaderSubmit,
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
} from '@vkontakte/vkui';
import { useAdaptivity } from '@vkontakte/vkui/dist/hooks/useAdaptivity';
import { Icon24HomeOutline, Icon28RefreshOutline, Icon16Globe } from '@vkontakte/icons';
import Main from './panels/Main';
import DetailsUser from './panels/DetailsUser';
import DetailsGroup from './panels/DetailsGroup';
import SearchPanel from './panels/SearchPanel';
import SliderSwitch from './components/SliderSwitch/SliderSwitch';
import Slider from './components/Slider/Slider';

import { StoreContext } from '../../store/store';

import { observer } from 'mobx-react-lite';

const PANEL_DETAILS_USER = 'PANEL_DETAILS_USER';
const PANEL_DETAILS_GROUP = 'PANEL_DETAILS_GROUP';
const PANEL_MAIN = 'PANEL_MAIN';
const PANEL_SEARCH = 'PANEL_SEARCH';
const MODAL_PAGE_FILTERS = 'FILTERS';
const MODAL_PAGE_SELECT_COUNTRY = 'SELECT_COUNTRY';
const MODAL_PAGE_SELECT_CITY = 'SELECT_CITY';

const Find = observer(({ id }) => {
  const Store = useContext(StoreContext);
  const { viewWidth } = useAdaptivity();
  const isMobile = viewWidth <= 2;
  const [activePanel, setActivePanel] = useState(PANEL_MAIN);
  const [activeModal, setActiveModal] = useState(null);
  const [text, setText] = useState('');
  const [filters, setFilters] = useState({
    country: Store.filters.country,
    city: Store.filters.city,
    sex: Store.filters.sex,
    age_from: Store.filters.age_from,
    age_to: Store.filters.age_to,
  });

  const go = useCallback((panelName) => setActivePanel(panelName), []);

  useEffect(() => {
    Store.filters.country && Store.filters.getCities(text);
  }, [Store.filters, text]);

  const onCloseModal = useCallback(() => {
    setFilters({
      country: Store.filters.country,
      city: Store.filters.city,
      sex: Store.filters.sex,
      age_from: Store.filters.age_from,
      age_to: Store.filters.age_to,
    });
    setActiveModal(null);
  }, [Store.filters.age_from, Store.filters.age_to, Store.filters.city, Store.filters.country, Store.filters.sex]);

  const onActiveModalFilters = useCallback(() => {
    setActiveModal(MODAL_PAGE_FILTERS);
  }, []);

  const onActiveModalSelectCountry = useCallback(() => {
    setActiveModal(MODAL_PAGE_SELECT_COUNTRY);
  }, []);

  const onActiveModalSelectCity = useCallback(() => {
    Store.filters.country && setActiveModal(MODAL_PAGE_SELECT_CITY);
  }, [Store.filters.country]);

  const onClickCountry = useCallback(
    (country) => {
      Store.filters.setCountry(country);
      Store.filters.getCities();
      setActiveModal(MODAL_PAGE_FILTERS);
    },
    [Store.filters]
  );

  const onClickCity = useCallback(
    (city) => {
      Store.filters.setCity(city);
      setText('');
      setActiveModal(MODAL_PAGE_FILTERS);
    },
    [Store.filters]
  );

  const onSwitchSex = useCallback(
    (value) => {
      Store.filters.setSex(value);
    },
    [Store.filters]
  );

  const onClickFilters = useCallback(() => {
    onActiveModalFilters();
    Store.filters.listCountries.length === 0 && Store.filters.getCountries();
  }, [Store.filters, onActiveModalFilters]);

  const onRefreshFilters = useCallback(() => {
    Store.filters.filterClear();
  }, [Store.filters]);

  const onChangeSliderAge = useCallback(
    (value) => {
      Store.filters.setAge_from(value[0]);
      Store.filters.setAge_to(value[1]);
    },
    [Store.filters]
  );

  const modal = (
    <ModalRoot activeModal={activeModal}>
      <ModalPage
        className="Overflow"
        id={MODAL_PAGE_FILTERS}
        onClose={onCloseModal}
        header={
          <ModalPageHeader
            left={isMobile && <PanelHeaderClose onClick={onCloseModal} />}
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
              {Store.filters.country && Store.filters.country.title}
            </SelectMimicry>
          </FormItem>
          <FormItem top="Город" onClick={onActiveModalSelectCity}>
            <SelectMimicry sizeY={SizeType.COMPACT} placeholder="Не выбран" disabled={!Store.filters.country}>
              {Store.filters.city && Store.filters.city.title}
            </SelectMimicry>
          </FormItem>
          <FormItem>
            <SliderSwitch
              activeValue={Store.filters.sex}
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
              age_from={Store.filters.age_from}
              age_to={Store.filters.age_to}
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
        onClose={onActiveModalFilters}
        header={
          <ModalPageHeader
            left={isMobile && <PanelHeaderClose onClick={onActiveModalFilters} />}
            right={<PanelHeaderSubmit onClick={onActiveModalFilters} />}
          >
            Выбор страны
          </ModalPageHeader>
        }
        className="Overflow"
      >
        <Group>
          <List>
            {Store.filters.listCountries.length > 0 ? (
              Store.filters.listCountries.map((country) => (
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
          <ModalPageHeader
            left={isMobile && <PanelHeaderClose onClick={onActiveModalFilters} />}
            right={<PanelHeaderSubmit onClick={onActiveModalFilters} />}
          >
            Выбор города
          </ModalPageHeader>
        }
        className="Overflow"
      >
        <Group>
          <Search value={text} onChange={(e) => setText(e.target.value)} />
          <List>
            {Store.filters.listCities.length > 0 ? (
              Store.filters.listCities.map((city) => (
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
    </ModalRoot>
  );

  return (
    <View id={id} activePanel={activePanel} modal={modal}>
      <Main id={PANEL_MAIN} go={go} />
      <DetailsUser id={PANEL_DETAILS_USER} go={go} />
      <DetailsGroup id={PANEL_DETAILS_GROUP} go={go} />
      <SearchPanel id={PANEL_SEARCH} go={go} onClickFilters={onClickFilters} filters={filters} />
    </View>
  );
});

export default Find;
