import React, { useCallback, useEffect, useState, useContext, useRef, useMemo } from 'react'
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
} from '@vkontakte/vkui'
import { Icon24HomeOutline, Icon28RefreshOutline, Icon16Globe } from '@vkontakte/icons'
import MainPanel from '../panels/MainPanel'
import TargetPanel from '../panels/TargetPanel'
import FeedbackPanel from '../panels/FeedbackPanel'
import CommentPanel from '../panels/CommentPanel'
import SearchPanel from '../panels/SearchPanel'
import Slider from '../components/Slider/Slider'
import CustomModalHeader from '../components/CustomModalHeader/CustomModalHeader'
import CustomSliderSwitch from '../components/SliderSwitch/SliderSwitch'
import Details from '../components/Details/Details'
import { observer } from 'mobx-react-lite'
import BRIDGE_API from '../API/bridge'
import { StoreContext } from '../store/store'

const PANEL_TARGET = 'PANEL_TARGET'
const PANEL_MAIN = 'PANEL_MAIN'
const PANEL_SEARCH = 'PANEL_SEARCH'
const PANEL_FEEDBACK = 'PANEL_FEEDBACK'
const PANEL_COMMENT = 'PANEL_COMMENT'

const MODAL_PAGE_FILTERS = 'MODAL_PAGE_FILTERS'
const MODAL_PAGE_SELECT_COUNTRY = 'MODAL_PAGE_SELECT_COUNTRY'
const MODAL_PAGE_SELECT_CITY = 'MODAL_PAGE_SELECT_CITY'
const MODAL_PAGE_DETAILS = 'MODAL_PAGE_DETAILS'

const Find = observer(({ id }) => {
  const Store = useContext(StoreContext)
  const platform = usePlatform()
  const [activePanel, setActivePanel] = useState(PANEL_MAIN)
  const [activeModal, setActiveModal] = useState(null)
  const [popout, setPopout] = useState(null)
  const [text, setText] = useState('')
  const [ageSlider, setAgeSlider] = useState({ age_from: 14, age_to: 80 })
  const debouncedSetAge = useRef()

  const forward = useCallback(
    (next) => {
      window.history.pushState(next, next, `#${next}`)
      setActivePanel(next)
      Store.Navigation.add(next)
    },
    [Store.Navigation]
  )

  const back = useCallback(() => {
    if (activeModal) {
      const from = Store.Navigation.back()
      if (from === MODAL_PAGE_FILTERS || from === MODAL_PAGE_DETAILS) {
        setActiveModal(null)
      } else {
        setActiveModal(Store.Navigation.last)
      }
    } else if (activePanel !== PANEL_MAIN) {
      Store.Navigation.back()
      setActivePanel(Store.Navigation.last)
    } else BRIDGE_API.APP_CLOSE()
  }, [Store.Navigation, activeModal, activePanel])

  const openModal = useCallback(
    (modal) => {
      setActiveModal(modal)
      window.history.pushState(modal, modal, `#${modal}`)
      Store.Navigation.add(modal)
    },
    [Store.Navigation]
  )

  const onActiveModalFilters = useCallback(() => {
    openModal(MODAL_PAGE_FILTERS)
  }, [openModal])

  const onActiveModalSelectCountry = useCallback(() => {
    openModal(MODAL_PAGE_SELECT_COUNTRY)
  }, [openModal])

  const onActiveModalSelectCity = useCallback(() => {
    Store.Filters.country.id && openModal(MODAL_PAGE_SELECT_CITY)
  }, [Store.Filters.country.id, openModal])

  const onActiveModalDetails = useCallback(() => {
    openModal(MODAL_PAGE_DETAILS)
  }, [openModal])

  const onClickCountry = useCallback(
    (country) => {
      Store.Filters.setCountry(country)
      Store.Filters.getCities()
      back()
    },
    [Store.Filters, back]
  )

  const onClickCity = useCallback(
    (city) => {
      Store.Filters.setCity(city)
      setText('')
      back()
    },
    [Store.Filters, back]
  )

  const onSwitchSex = useCallback(
    (value) => {
      Store.Filters.setSex(value)
    },
    [Store.Filters]
  )

  const onClickFilters = useCallback(() => {
    onActiveModalFilters()
    Store.Filters.listCountries.length === 0 && Store.Filters.getCountries()
  }, [Store.Filters, onActiveModalFilters])

  const onRefreshFilters = useCallback(() => {
    Store.Filters.filterClear()
  }, [Store.Filters])

  const onChangeSliderAge = useCallback(
    (value) => {
      if (debouncedSetAge.current) clearTimeout(debouncedSetAge.current)
      debouncedSetAge.current = setTimeout(() => {
        Store.Filters.setAge_from(value[0])
        Store.Filters.setAge_to(value[1])
      }, 250)
      setAgeSlider({ age_from: value[0], age_to: value[1] })
    },
    [Store.Filters]
  )

  useEffect(() => {
    Store.Filters.country.id && Store.Filters.getCities(text)
  }, [Store.Filters, text])

  useEffect(() => {
    window.addEventListener('popstate', back)

    return () => window.removeEventListener('popstate', back)
  }, [back])

  useEffect(() => {
    forward(PANEL_MAIN)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const modal = (
    <ModalRoot activeModal={activeModal}>
      <ModalPage
        id={MODAL_PAGE_FILTERS}
        onClose={back}
        header={
          <ModalPageHeader
            left={<PanelHeaderClose onClick={back} />}
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
            <Button size="l" stretched mode="outline" onClick={back}>
              Показать результаты
            </Button>
          </FormItem>
        </Group>
      </ModalPage>
      <ModalPage
        id={MODAL_PAGE_SELECT_COUNTRY}
        onClose={back}
        dynamicContentHeight={100}
        header={
          <CustomModalHeader onCloseClick={back} platform={platform}>
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
        onClose={back}
        header={
          <CustomModalHeader onCloseClick={back} platform={platform}>
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
        onClose={back}
        header={
          <CustomModalHeader onCloseClick={back} platform={platform}>
            Подробнее
          </CustomModalHeader>
        }
      >
        <Details target={Store.Target[Store.Target.type]} type={Store.Target.type} />
      </ModalPage>
    </ModalRoot>
  )
  const go = useMemo(() => ({ forward, back }), [back, forward])
  return (
    <View
      id={id}
      activePanel={activePanel}
      modal={modal}
      popout={popout}
      history={Store.Navigation.history}
      onSwipeBack={back}
    >
      <MainPanel id={PANEL_MAIN} go={go} />
      <TargetPanel id={PANEL_TARGET} go={go} onClickDetails={onActiveModalDetails} setPopout={setPopout} />
      <SearchPanel id={PANEL_SEARCH} go={go} onClickFilters={onClickFilters} />
      <FeedbackPanel id={PANEL_FEEDBACK} go={go} />
      <CommentPanel id={PANEL_COMMENT} go={go} />
    </View>
  )
})

export default Find
