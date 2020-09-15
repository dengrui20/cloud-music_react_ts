import { ActionType, ActionThunk } from '../../../../store/types'
import { fromJS } from 'immutable'
import { playMode, SongInfo, Lyric } from './types'
import playerInstance from '../Player'
import { Toast } from 'antd-mobile'
import { requestLyric } from '../../../../request/requestMehtods'
import { parseLyric } from '../../../../utils/index'

export const SET_FULLSCREEN = 'player/SET_FULLSCREEN'
export const SET_PLAY_LIST = 'player/SET_PLAY_LIST'
export const SET_CURRENT_TIME = 'player/SET_CURRENT_TIME'
export const SET_PLAY_MODE = 'player/SET_PLAY_MODE'
export const SET_CURRENT_SONG = 'player/SET_CURRENT_SONG'
export const SET_SHOW_PLAY_LIST = 'player/SET_SHOW_PLAY_LIST'
export const SET_IS_PLAYING = 'player/SET_IS_PLAYING'
export const SET_LYRIC = 'player/SET_LYRIC'

export const setFullScreen = (isFullScreen: boolean = false): ActionType => {
  return {
    type: SET_FULLSCREEN,
    data: isFullScreen
  }
}

export const setCurrentSong: ActionThunk = (song: SongInfo) => {
  return (dispatch, getState) => {
    const { currentSong } = getState().getIn(['player']).toJS()
    if (playerInstance.currentSong.id !== currentSong.id) {
      requestLyric(playerInstance.currentSong.id).then(({ data }) => {
        if (data && data.success) {
          if (data.lrc) {
            dispatch(setLyric(parseLyric(data.lrc.lyric)))
          } else {
            dispatch(setLyric([]))
          }
        }
      })
    }
    dispatch({
      type: SET_CURRENT_SONG,
      data: fromJS(playerInstance.currentSong)
    })
  }
} 

export const setLyric = (lrc: Lyric[]) => {
  return {
    type: SET_LYRIC,
    data: fromJS(lrc)
  }
}

export const setPlayList: ActionThunk = (playList: SongInfo[] | SongInfo) => {
  return (dispatch) => {
    playerInstance.addMusic(playList)
    

    dispatch({
      type: SET_PLAY_LIST,
      data: fromJS(playerInstance.playList)
    })
    dispatch(setCurrentSong())
  }
}

export const deleteMusic: ActionThunk = (music: SongInfo) => {
  return (dispatch) => {
    playerInstance.deleteMusic(music)
    if (!playerInstance.playList.length) {
      dispatch(setFullScreen(false))
      dispatch(setShowPlayList(false))
    }
    dispatch({
      type: SET_PLAY_LIST,
      data: fromJS(playerInstance.playList)
    })
  }
}

export const deleteAllMusic: ActionThunk = () => {
  return (dispatch) => {
    playerInstance.deleteAllMusic()
    dispatch(setFullScreen(false))
    dispatch(setShowPlayList(false))
    dispatch({
      type: SET_PLAY_LIST,
      data: fromJS(playerInstance.playList)
    })
    dispatch(setCurrentSong())
  }
}

export const setCurrentTime = (time: number): ActionType => {
  return {
    type: SET_CURRENT_TIME,
    data: time
  }
}

export const setPlayMode = (mode: playMode): ActionType => {
  playerInstance.changePlayMode(mode)
  let tip = ''
  switch (mode) {
    case playMode.single:
      tip = '单曲播放'
      break;
    case playMode.loop:
      tip = '顺序播放'
      break;
    case playMode.random:
      tip = '随机播放'
      break;
  }
  Toast.info('已切换:' + tip, 1, undefined, false)

  return {
    type: SET_PLAY_MODE,
    data: mode
  }
}

export const setShowPlayList = (showPlayList: boolean): ActionType => {
  return {
    type: SET_SHOW_PLAY_LIST,
    data: showPlayList
  }
}

export const setIsPlaying = (isPlaying: boolean): ActionType => {
  playerInstance.isPlaying = isPlaying
  return {
    type: SET_IS_PLAYING,
    data: isPlaying
  }
}

export const nextMusic: ActionThunk = () => {
  playerInstance.next()
  return (dispatch) => {
    dispatch(setCurrentSong())
  }
}

export const prevMusic: ActionThunk = () => {
  playerInstance.prev()
  return (dispatch) => {
    dispatch(setCurrentSong())
  }
}

