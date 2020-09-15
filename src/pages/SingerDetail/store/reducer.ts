import { fromJS } from 'immutable';
import { SingerDetailInitState } from './types'
import {
  SET_HOT_SONG,
  SET_SINGER_DETAIL
} from './actions';
import { ActionType } from '../../../store/types'

const initState:SingerDetailInitState = {
  hotSongList: [],
  singerDetail: {}
}

const reducer = (state = fromJS(initState), { type, data }: ActionType) => {
  switch (type) {
    case SET_HOT_SONG:
      return state.set('hotSongList', data)
    case SET_SINGER_DETAIL:
      return state.set('singerDetail', data)
    default:
      return state
  }
}

export default reducer
