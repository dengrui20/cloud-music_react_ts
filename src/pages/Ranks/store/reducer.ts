import { fromJS } from 'immutable';
import {
  SET_OFFICIAL_LIST,
  SET_GLOBAL_LIST
} from './actions';

import { ActionType } from '../../../store/types'
import { RankInitState } from './types'

const initState: RankInitState = {
  officialList: [],
  globalList: []
}



const reducer = (state = fromJS(initState), { type, data }: ActionType) => {
  switch (type) {
    case SET_OFFICIAL_LIST:
      return state.set('officialList', data)
    case SET_GLOBAL_LIST:
      return state.set('globalList', data)
    default:
      return state
  }

}

export default reducer
