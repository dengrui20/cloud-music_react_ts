import { fromJS } from 'immutable';
import utils from '../../../../utils'
import { ActionType } from '../../../../store/types'
import {
  SET_HOT_SEATCH_LIST,
  SET_SEARCH_HISTORY_LIST,
  SET_SEATCH_LIST,
  SET_FOCUSED
} from './actions';
import { SearchBarInitState } from './types'


const initState: SearchBarInitState = {
  searchHistoryList: utils.storageGetSearchHistoryList() || [],
  hotSearchList: [],
  searchResultList: [],
  focused: false
}



const reducer = (state = fromJS(initState), { type, data } : ActionType) => {
  switch (type) {
    case SET_SEARCH_HISTORY_LIST:
      return state.set('searchHistoryList', data)
    case SET_HOT_SEATCH_LIST:
      return state.set('hotSearchList', data)
    case SET_SEATCH_LIST:
      return state.set('searchResultList', data)
    case SET_FOCUSED:
      return state.set('focused', data)
    default:
      return state
  }
}

export default reducer
