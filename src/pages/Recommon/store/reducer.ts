import { fromJS } from 'immutable';
import { ActionType } from '../../../store/types'

import {
  SET_BANNER_LIST,
  SET_NEWSONE_LIST,
  SET_RECOMMON_LIST
} from './actions';

import { RecommonInitState } from "./types";


const initState:RecommonInitState = {
  bannerList: [],
  recommonList: [],
  newSongList: []
}



const reducer = (state = fromJS(initState), { type, data }: ActionType) => {
  switch (type) {
    case SET_BANNER_LIST:
      return state.set('bannerList', data)
    case SET_NEWSONE_LIST:
      return state.set('newSongList', data)
    case SET_RECOMMON_LIST:
      return state.set('recommonList', data)
    default:
      return state
  }
}

export default reducer
