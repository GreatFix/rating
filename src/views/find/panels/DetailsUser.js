import React from 'react';
import { observer } from 'mobx-react-lite';
import DetailsUser from '../../../store/detailsUser';
import {
  ANDROID,
  Avatar,
  CellButton,
  Gradient,
  Group,
  Header,
  IOS,
  MiniInfoCell,
  ModalPage,
  ModalPageHeader,
  ModalRoot,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  PanelHeaderButton,
  RichCell,
  Separator,
  SizeType,
  Text,
  Title,
  usePlatform,
  UsersStack,
  View,
  VKCOM,
  withAdaptivity,
} from '@vkontakte/vkui';
import {
  Icon20CalendarOutline,
  Icon20FollowersOutline,
  Icon20HomeOutline,
  Icon20Info,
  Icon20MentionOutline,
  Icon20MessageOutline,
  Icon20User,
  Icon24Cancel,
  Icon24Dismiss,
  Icon28AddOutline,
} from '@vkontakte/icons';

const Details = observer(({ id, go, sizeX }) => {

  const platform = usePlatform();
  const [activeModal, setActiveModal] = React.useState(null);

  const handleExtendedInfoClick = () => {
    setActiveModal('extended_info');
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const modal = (
    <ModalRoot activeModal={ activeModal } onClose={ closeModal } className={ 'Overflow' }>
      <ModalPage
        header={
          <ModalPageHeader
            left={ (platform === ANDROID || platform === VKCOM) &&
            <PanelHeaderButton onClick={ closeModal }><Icon24Cancel /></PanelHeaderButton> }
            right={ platform === IOS &&
            <PanelHeaderButton onClick={ closeModal }><Icon24Dismiss /></PanelHeaderButton> }
            noShadow
          >
            Подробнее
          </ModalPageHeader>
        }
        id="extended_info"
      >

        <Separator style={ { marginBottom: 12 } } />

        <MiniInfoCell
          before={ <Icon20User /> }
          textWrap="full"
          textLevel="primary"
        >
          { DetailsUser.info && DetailsUser.info.first_name } { DetailsUser.info && DetailsUser.info.last_name }
        </MiniInfoCell>

        <MiniInfoCell
          before={ <Icon20MessageOutline /> }
          textWrap="full"
          textLevel="primary"
        >
          "За правду приходиться страдать"
        </MiniInfoCell>

        <MiniInfoCell
          before={ <Icon20HomeOutline /> }
          textWrap="full"
          textLevel="primary"
        >
          Москва
        </MiniInfoCell>

        <MiniInfoCell
          before={ <Icon20FollowersOutline /> }
          after={
            <UsersStack
              photos={ [
                'https://sun9-28.userapi.com/impg/9dL3gsFd4XJL7lkgK2FdqFl8u8JwUhm18xPAUA/--PGVL2UHKs.jpg?size=1620x2160&quality=96&sign=800bcfc157637d824fd4fdcd6ac63ea6&type=album',
                'https://sun9-23.userapi.com/impg/WRYuU4DJdB2OREgHmJv0cQlqhuZziEqedaKRqA/iEIcS_mfx84.jpg?size=1200x1600&quality=96&sign=ca9029bef146df09979c4b59d859725b&type=album',
                'https://sun9-75.userapi.com/impf/c855624/v855624094/24aefc/zj0_mhUahlA.jpg?size=995x995&quality=96&sign=f96523d151b779bf143439941a8bb6b1&type=album',


              ] }
            />
          }
        >
          138 друзей · 17 общих
        </MiniInfoCell>

        <Separator style={ { marginTop: 12, marginBottom: 12 } } />

        <MiniInfoCell
          before={ <Icon20MentionOutline /> }

        >
          @durov
        </MiniInfoCell>

        <MiniInfoCell
          before={ <Icon20CalendarOutline /> }

        >
          Дата регистрации: 01.01.1970
        </MiniInfoCell>

        <div style={ { height: 50 } } />
      </ModalPage>
    </ModalRoot>
  );

  return (
    <View activePanel={ id } modal={ modal }>
      <Panel id={ id } className={ 'Overflow' }>
        <PanelHeader
          left={
            <PanelHeaderBack
              onClick={ () => {
                go('main');
                DetailsUser.infoClear();
              } }
            />
          }
        >
          Информация о пользователе
        </PanelHeader>
        <Group>
          <Gradient style={ {
            margin: sizeX === SizeType.REGULAR ? '-7px -7px 0 -7px' : 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 32,
          } }>
            <Avatar size={ 96 } src={ DetailsUser.info && DetailsUser.info.photo_50 } />
            <Title style={ { marginBottom: 8, marginTop: 20 } } level="2" weight="medium">
              { DetailsUser.info && DetailsUser.info.first_name } { DetailsUser.info && DetailsUser.info.last_name }
            </Title>
            <Text style={ { marginBottom: 8, color: 'var(--text_secondary)' } }>70% положительных отзывов</Text>
            <MiniInfoCell
              before={ <Icon20Info /> }
              mode="more"
              onClick={ handleExtendedInfoClick }
            >
              Подробная информация
            </MiniInfoCell>
          </Gradient>
          <Group mode="plain">
            <Header>Учебные заведения и классы</Header>
            <CellButton before={ <Icon28AddOutline /> }>Написать отзыв</CellButton>

            <RichCell
              multiline={ true }
              before={ <Avatar size={ 48 }
                               src={ 'https://sun2-9.userapi.com/s/v1/ig2/JGiYTleVNv9LtJoYGm0ihr-xvBLpnxxeX0kEs-PKBsoN_17PQ_IClctkZhJckIgz7aTPBnLQ9xrhw2A-r3fxc17M.jpg?size=50x0&quality=96&crop=65,265,551,551&ava=1' } /> }
              text="Хендерсон обновил свою одежду, заменив гавайку на кожаную жилетку с принтом в виде садового гнома в
              авиаторах, кидающего «козу». Он также сменил шорты на штаны карго, так как ему нужно было больше карманов."
              caption="Вчера в 20:30"
              after="🟢 Положительный"
            >
              Константин Черных
            </RichCell>

          </Group>
        </Group>
      </Panel>
    </View>
  );
});

const ExampleWithAdaptivity = withAdaptivity(Details, { sizeX: true });

<ExampleWithAdaptivity />;

export default Details;
