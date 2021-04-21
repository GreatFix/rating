import React, { useCallback, useEffect, useContext } from 'react';
import {
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
} from '@vkontakte/vkui';
import { Icon24Camera } from '@vkontakte/icons';
import { StoreContext } from '../../../../store/store';
import { observer } from 'mobx-react-lite';
import Preview from '../../components/Preview/Preview';
const COUNT_IMAGES = 2;

const CommentPanel = observer(({ id, go }) => {
  const Store = useContext(StoreContext);

  useEffect(() => {
    (async function () {
      await Store.Comment.request();
      go.back();
    })();

    return () => Store.Comment.clear();
  }, [Store.Comment, go]);

  const onChangeContent = useCallback(
    (e) => {
      Store.Comment.setContent(e.target.value);
    },
    [Store.Comment]
  );

  const onChangeImages = useCallback(
    (e) => {
      Array.from(e.target.files).forEach((file, index) => {
        if (!file.type.match('image')) {
          return;
        }
        const reader = new FileReader();

        reader.onload = (e) => {
          const src = e.target.result;
          Store.Comment.setImages([...Store.Comment.images, src]);
        };

        reader.readAsDataURL(file);
      });
    },
    [Store.Comment]
  );

  const handleClickRemoveImage = useCallback(
    (e) => {
      if (e.target.dataset.id) {
        Store.Comment.setImages(Store.Comment.images.filter((img) => img.id !== parseInt(e.target.dataset.id)));
      } else {
        Store.Comment.setImages(Store.Comment.images.filter((src) => src !== e.target.dataset.src));
      }
    },
    [Store.Comment]
  );

  const handleClickSubmitComment = useCallback(
    (e) => {
      e.preventDefault();
      if (Store.Comment.images.length > COUNT_IMAGES)
        return Store.Comment.setValidateError('Превышено количество изображений');
      if (Store.Comment.content.length > 1000) return Store.Comment.setValidateError('Превышено количество символов');
      Store.Comment.setValidateError('');
      Store.Comment.setSending(true);
      Store.Comment.setReady(true);
    },
    [Store.Comment]
  );

  return (
    <Panel id={id} className="Overflow">
      <PanelHeader left={<PanelHeaderBack onClick={go.back} />}>Редактирование комментария</PanelHeader>
      <Group>
        <FormLayout className="Overflow">
          <FormItem
            top="Комментарий"
            status={Store.Comment.content.length > 1000 ? 'error' : 'valid'}
            bottom={Store.Comment.content.length > 1000 && 'Комментарий не должен содержать более 1000 символов!'}
          >
            <Textarea name="content" value={Store.Comment.content} onChange={onChangeContent} />
          </FormItem>
          {Store.Comment.images.length > 0 && (
            <Group>
              <CardScroll>
                {Store.Comment.images?.map((img, index) => (
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
            status={Store.Comment.images.length > COUNT_IMAGES ? 'error' : 'valid'}
            bottom={Store.Comment.images.length > COUNT_IMAGES && `Нельзя загрузить более ${COUNT_IMAGES} изображений!`}
          >
            <File
              multiple={true}
              accept="image/*"
              name="images"
              onChange={onChangeImages}
              before={
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Icon24Camera />
                  <Counter>{Store.Comment.images?.length}</Counter>
                </div>
              }
              controlSize="m"
            >
              Открыть галерею
            </File>
          </FormItem>
          {Store.Comment.validateError && (
            <FormItem>
              <FormStatus header="Некорректное заполнение формы" mode={'error'}>
                {Store.Comment.validateError}
              </FormStatus>
            </FormItem>
          )}
          <FormItem>
            <Button onClick={handleClickSubmitComment} disabled={Store.Comment.sending} size="l" stretched>
              {Store.Comment.sending ? <Spinner /> : 'Сохранить'}
            </Button>
          </FormItem>
        </FormLayout>
      </Group>
    </Panel>
  );
});

export default CommentPanel;
