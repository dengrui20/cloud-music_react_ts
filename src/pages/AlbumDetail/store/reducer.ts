import { fromJS } from 'immutable';
import { ActionType } from '../../../store/types'
import { AlbumInitState } from './types'
import { SET_ALBUM_LIST, SET_ALBUM_DETAIL } from './actions'

const initState:AlbumInitState = {
  albumList: [],
  albumDetail: {
    cover: '',
    listenCount: '',
    person: '',
    avatar: '',
    name: '',
    collect: ''
  }
}

const reducer = (state = fromJS(initState), { type, data }: ActionType) => {
  switch (type) {
    case SET_ALBUM_LIST:
      return state.set('albumList', data);
    case SET_ALBUM_DETAIL:
      return state.set('albumDetail', data);
    default:
      return state
  }
}

export default reducer
