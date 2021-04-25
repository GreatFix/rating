import React from 'react'
import { Counter } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import classes from './CounterFeedbacks.module.css'

const CounterFeedbacks = observer(({ feedbacks }) => (
  <div className={classes.CountFeedbackTypes}>
    <Counter size="s" className={classes.CounterPositive}>
      {feedbacks?.data?.countPositiveFeedbacks ?? 0}
    </Counter>
    <Counter size="s" mode="prominent" className={classes.CounterNegative}>
      {feedbacks?.data?.countNegativeFeedbacks ?? 0}
    </Counter>
  </div>
))

export default CounterFeedbacks
