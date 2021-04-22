import React, { useCallback, useEffect, useContext } from 'react'
import {
  SliderSwitch,
  FormLayout,
  Group,
  Textarea,
  FormItem,
  File,
  Button,
  CardScroll,
  Counter,
  FormStatus,
  Spinner,
  Panel,
  PanelHeader,
  PanelHeaderBack,
} from '@vkontakte/vkui'
import { Icon24Camera } from '@vkontakte/icons'
import { StoreContext } from '../../../../store/store'
import { observer } from 'mobx-react-lite'
import Preview from '../../components/Preview/Preview'
const CREATE_FEEDBACK = 'createFeedback'
const COUNT_IMAGES = 10
const FeedbackPanel = observer(({ id, go }) => {
  const Store = useContext(StoreContext)

  useEffect(() => {
    ;(async function () {
      await Store.Feedback.request()
      go.back()
    })()

    return () => Store.Feedback.clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSwitchConclusion = useCallback(
    (value) => {
      Store.Feedback.setConclusion(value)
    },
    [Store.Feedback]
  )

  const onChangeContent = useCallback(
    (e) => {
      Store.Feedback.setContent(e.target.value)
    },
    [Store.Feedback]
  )

  const onChangeImages = useCallback(
    (e) => {
      Array.from(e.target.files).forEach((file, index) => {
        if (!file.type.match('image')) {
          return
        }
        const reader = new FileReader()

        reader.onload = (e) => {
          const src = e.target.result
          Store.Feedback.setImages([...Store.Feedback.images, src])
        }

        reader.readAsDataURL(file)
      })
    },
    [Store.Feedback]
  )

  const handleClickRemoveImage = useCallback(
    (e) => {
      if (e.target.dataset.id) {
        console.log(e.target.dataset.id)
        Store.Feedback.setImages(Store.Feedback.images.filter((img) => img.id !== parseInt(e.target.dataset.id)))
      } else {
        Store.Feedback.setImages(Store.Feedback.images.filter((src) => src !== e.target.dataset.src))
      }
    },
    [Store.Feedback]
  )

  const handleClickSubmitFeedback = useCallback(
    (e) => {
      e.preventDefault()
      if (Store.Feedback.images.length > COUNT_IMAGES)
        return Store.Feedback.setValidateError('Превышено количество изображений')
      if (Store.Feedback.content.length > 1000) return Store.Feedback.setValidateError('Превышено количество символов')
      if (Store.Feedback.conclusion !== 'positive' && Store.Feedback.conclusion !== 'negative')
        return Store.Feedback.setValidateError('Выберите тип отзыва')
      Store.Feedback.setValidateError('')

      Store.Feedback.setSending(true)
      Store.Feedback.setReady(true)
    },
    [Store.Feedback]
  )

  return (
    <Panel id={id} className="Overflow">
      <PanelHeader left={<PanelHeaderBack onClick={go.back} />}>
        {Store.Feedback.type === CREATE_FEEDBACK ? 'Добавление' : 'Редактирование'} отзыва
      </PanelHeader>
      <Group>
        <FormLayout className="Overflow">
          <FormItem top="Тип">
            <SliderSwitch
              name="conclusion"
              activeValue={Store.Feedback.conclusion}
              onSwitch={onSwitchConclusion}
              options={[
                {
                  name: 'Положительный',
                  value: 'positive',
                },
                {
                  name: 'Отрицательный',
                  value: 'negative',
                },
              ]}
            />
          </FormItem>
          <FormItem
            top="Комментарий"
            status={Store.Feedback.content.length > 1000 ? 'error' : 'valid'}
            bottom={Store.Feedback.content.length > 1000 && 'Комментарий не должен содержать более 1000 символов!'}
          >
            <Textarea name="content" value={Store.Feedback.content} onChange={onChangeContent} />
          </FormItem>
          {Store.Feedback.images.length > 0 && (
            <Group>
              <CardScroll>
                {Store.Feedback.images?.map((img, index) => (
                  <Preview
                    key={img?.id ? img.id : img?.slice(50, 100) + index}
                    img={img}
                    index={index}
                    size={96}
                    maxCount={COUNT_IMAGES}
                    onClickRemove={handleClickRemoveImage}
                  />
                ))}
              </CardScroll>
            </Group>
          )}
          <FormItem
            top="Загрузите фото"
            status={Store.Feedback.images.length > COUNT_IMAGES ? 'error' : 'valid'}
            bottom={
              Store.Feedback.images.length > COUNT_IMAGES && `Нельзя загрузить более ${COUNT_IMAGES} изображений!`
            }
          >
            <File
              multiple={true}
              accept="image/*"
              name="images"
              onChange={onChangeImages}
              before={
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Icon24Camera />
                  <Counter>{Store.Feedback.images?.length}</Counter>
                </div>
              }
              controlSize="m"
            >
              Открыть галерею
            </File>
          </FormItem>
          {Store.Feedback.validateError && (
            <FormItem>
              <FormStatus header="Некорректное заполнение формы" mode={'error'}>
                {Store.Feedback.validateError}
              </FormStatus>
            </FormItem>
          )}
          <FormItem>
            <Button onClick={handleClickSubmitFeedback} disabled={Store.Feedback.sending} size="l" stretched>
              {Store.Feedback.sending ? <Spinner /> : 'Отправить'}
            </Button>
          </FormItem>
        </FormLayout>
      </Group>
    </Panel>
  )
})

export default FeedbackPanel
