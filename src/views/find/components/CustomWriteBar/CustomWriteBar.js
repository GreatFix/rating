import React, { useCallback, useContext, useRef, useEffect } from 'react'
import { FixedLayout, WriteBar, WriteBarIcon, Group, CardScroll, Separator } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../../../../store/store'
import Preview from '../../components/Preview/Preview'

const COUNT_IMAGES = 2

const CustomWriteBar = observer(({ comment }) => {
  const Store = useContext(StoreContext)

  useEffect(() => {
    ;(async function () {
      await Store.Comment.request()
      Store.Target.setReply(false)
      Store.Target.getInfo()
    })()

    return () => Store.Comment.clear()
  }, [Store.Comment, Store.Target])
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
      Store.Comment.setReady(true)
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
        {comment?.images && (
          <>
            <Separator wide />
            {comment.images.length > 0 && (
              <Group>
                <CardScroll>
                  {comment.images?.map((img, index) => (
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
          value={comment?.content}
          onChange={onChangeWriteBar}
          before={<WriteBarIcon mode="attach" onClick={handleClickFileInput} count={comment?.imagesURL?.length} />}
          after={<WriteBarIcon mode="send" onClick={handleClickSend} disabled={comment?.content.length === 0} />}
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
