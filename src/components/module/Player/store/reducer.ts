import { fromJS } from 'immutable'
import { PlayerInitState, playMode } from './types'
import { ActionType } from '../../../../store/types'
import {
  SET_FULLSCREEN,
  SET_PLAY_LIST,
  SET_CURRENT_TIME,
  SET_PLAY_MODE,
  SET_CURRENT_SONG,
  SET_SHOW_PLAY_LIST,
  SET_IS_PLAYING,
  SET_LYRIC
} from '../../Player/store/actions'
const playerInitState: PlayerInitState = {
  fullScreen: false,
  playList: [],
  currentTime: 0,
  playMode: playMode.loop,
  currentSong: {},
  showPlayList: false,
  isPlaying: false,
  process: 0,
  lyrics: []
}

const reducer = (state = fromJS(playerInitState), { type, data }: ActionType) => {
  switch (type) {
    case SET_FULLSCREEN:
      return state.set('fullScreen', data);
    case SET_PLAY_LIST:
      return state.set('playList', data);
    case SET_CURRENT_TIME:
      return state.set('currentTime', data);
    case SET_PLAY_MODE:
      return state.set('playMode', data);
    case SET_CURRENT_SONG:
      return state.set('currentSong', data);
    case SET_SHOW_PLAY_LIST:
      return state.set('showPlayList', data);
    case SET_IS_PLAYING:
      return state.set('isPlaying', data);
    case  SET_LYRIC:
      return state.set('lyrics', data);
    default:
      return state
  }
}

export default reducer