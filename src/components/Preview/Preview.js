import React from 'react'
import { Avatar, Card } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import './Preview.css'

const Preview = observer(({ img, index, maxCount, onClickRemove, size }) => {
  return img?.id ? (
    <Card className="Preview">
      <Avatar className="Preview--image" mode="image" src={img.MinSize.url} size={size} />
      <div className="Preview--remove" data-id={img.id} onClick={onClickRemove}>
        &times;
      </div>
      {index > maxCount - 1 && <div className="Preview--error">Не более {maxCount} файлов</div>}
    </Card>
  ) : (
    <Card className="Preview">
      <Avatar className="Preview--image" mode="image" src={img} size={size} />
      <div className="Preview--remove" data-src={img} onClick={onClickRemove}>
        &times;
      </div>
      {index > maxCount - 1 && <div className="Preview--error">Не более {maxCount} файлов</div>}
    </Card>
  )
})

export default Preview
