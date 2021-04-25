import React, { useCallback, useState, useEffect, useContext, useMemo } from 'react'
import { View, ModalRoot, ModalPage, usePlatform } from '@vkontakte/vkui'
import HomePanel from '../panels/HomePanel'
import AboutPanel from '../panels/AboutPanel'
import TargetPanel from '../panels/TargetPanel'
import FeedbackPanel from '../panels/FeedbackPanel'
import CommentPanel from '../panels/CommentPanel'
import CustomModalHeader from '../components/CustomModalHeader/CustomModalHeader'
import Details from '../components/Details/Details'
import BRIDGE_API from '../API/bridge'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../store/store'

const PANEL_HOME = 'PANEL_HOME'
const PANEL_ABOUT = 'PANEL_ABOUT'
const PANEL_TARGET = 'PANEL_TARGET'
const PANEL_FEEDBACK = 'PANEL_FEEDBACK'
const PANEL_COMMENT = 'PANEL_COMMENT'
const MODAL_PAGE_DETAILS = 'MODAL_PAGE_DETAILS'

const Profile = observer(({ id }) => {
  const Store = useContext(StoreContext)
  const platform = usePlatform()
  const [activePanel, setActivePanel] = useState(PANEL_HOME)
  const [activeModal, setActiveModal] = useState(null)
  const [popout, setPopout] = useState(null)

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
      Store.Navigation.back()
      setActiveModal(null)
    } else if (activePanel !== PANEL_HOME) {
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

  const onActiveModalDetails = useCallback(() => {
    openModal(MODAL_PAGE_DETAILS)
  }, [openModal])

  const modal = (
    <ModalRoot activeModal={activeModal}>
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

  useEffect(() => {
    window.addEventListener('popstate', back)
    return () => window.removeEventListener('popstate', back)
  }, [back])

  useEffect(() => {
    forward(PANEL_HOME)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View
      id={id}
      activePanel={activePanel}
      history={Store.Navigation.history}
      onSwipeBack={back}
      modal={modal}
      popout={popout}
    >
      <HomePanel id={PANEL_HOME} go={go} />
      <AboutPanel id={PANEL_ABOUT} go={go} setPopout={setPopout} />
      <TargetPanel id={PANEL_TARGET} go={go} onClickDetails={onActiveModalDetails} setPopout={setPopout} />
      <FeedbackPanel id={PANEL_FEEDBACK} go={go} />
      <CommentPanel id={PANEL_COMMENT} go={go} />
    </View>
  )
})

export default Profile
