import { fromJS } from 'immutable';

import { ActionType } from '../../../store/types'
import {
  SET_SINGER_LIST,
  SET_FETCHING,
  SET_SINGER_AREA,
  SET_SINGER_TYPE
} from './actions';

import { SingerInitState } from './types'

const initState:SingerInitState = {
  singerList: {
    data: [],
    page: 1
  },
  singerType: -1,
  singerArea: -1,
  isFetching: false
}

const reducer = (state = fromJS(initState), { type, data }: ActionType) => {
  switch (type) {
    case SET_SINGER_LIST:
      return state.set('singerList', data)
    case SET_FETCHING:
      return state.set('isFetching', data)
    case SET_SINGER_AREA:
      return state.set('singerArea', data)
    case SET_SINGER_TYPE:
      return state.set('singerType', data)
    default:
      return state
  }
}

export default reducer
