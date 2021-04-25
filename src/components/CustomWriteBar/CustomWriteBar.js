import React, { useCallback, useContext, useRef, useEffect } from 'react'
import { FixedLayout, WriteBar, WriteBarIcon, Group, CardScroll, Separator } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import Preview from '../Preview/Preview'
import { StoreContext } from '../../store/store'

const COUNT_IMAGES = 2

const CustomWriteBar = observer(({ store }) => {
  const Store = useContext(StoreContext)

  useEffect(() => {
    ;(async function () {
      await Store.Comment.completed()
      store.setReply(false)
      store.sendedComment()
    })()

    return () => Store.Comment.clear()
  }, [Store.Comment, store])
  const inputFileRef = useRef()
  const handleClickFileInput = useCallback(() => {
    inputFileRef.current.click()
  }, [])

  const handleClickRemoveImage = useCallback(
    (e) => {
      Store.Comment.setImages(Store.Comment.images.filter((src) => src !== e.target.dataset.src))
    },
    [Store.Comment]
  )

  const handleClickSend = useCallback(
    (e) => {
      Store.Comment.request()
      Store.Comment.setSending(true)
    },
    [Store.Comment]
  )

  const onChangeWriteBar = useCallback(
    (e) => {
      Store.Comment.setContent(e.target.value)
    },
    [Store.Comment]
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
          if (!Store.Comment.images.includes(src)) {
            Store.Comment.setImages([...Store.Comment.images, src])
          }
        }

        reader.readAsDataURL(file)
      })
    },
    [Store.Comment]
  )
  return (
    <FixedLayout vertical="bottom" filled={true}>
      <Group>
        {Store.Comment?.images && (
          <>
            <Separator wide />
            {Store.Comment.images.length > 0 && (
              <Group>
                <CardScroll>
                  {Store.Comment.images?.map((img, index) => (
                    <Preview
                      key={img?.id ? img.id : img?.slice(50, 100) + index}
                      img={img}
                      index={index}
                      size={64}
                      maxCount={COUNT_IMAGES}
                      onClickRemove={handleClickRemoveImage}
                    />
                  ))}
                </CardScroll>
              </Group>
            )}
          </>
        )}
        <Separator wide />
        <WriteBar
          value={Store.Comment?.content}
          onChange={onChangeWriteBar}
          before={
            <WriteBarIcon
              mode="attach"
              onClick={handleClickFileInput}
              count={Store.Comment?.imagesURL?.length}
              disabled={Store.Comment?.sending}
            />
          }
          after={
            <WriteBarIcon
              mode="send"
              onClick={handleClickSend}
              disabled={Store.Comment?.content.length === 0 || Store.Comment?.sending}
            />
          }
          placeholder="Комментарий"
        />
        <input
          ref={inputFileRef}
          hidden
          type="file"
          multiple={true}
          accept="image/*"
          name="images[]"
          onChange={onChangeImages}
        />
        <Separator wide />
      </Group>
    </FixedLayout>
  )
})
export default CustomWriteBar
