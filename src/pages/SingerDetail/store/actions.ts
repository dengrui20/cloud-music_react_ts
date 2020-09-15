import { fromJS } from 'immutable';
import { requestSingerDetail } from '../../../request/requestMehtods';
import { ActionThunk, ActionType } from '../../../store/types'
export const SET_HOT_SONG = 'singerDetail/SET_HOT_SONG'
export const SET_SINGER_DETAIL = 'singerDetail/SET_SINGER_DETAIL'

export const setSingerDetail = (data = {}): ActionType => {
  return {
    type: SET_SINGER_DETAIL,
    data: fromJS(data)
  }
}

export const setHotSong = (data = []): ActionType => {
  return {
    type: SET_HOT_SONG,
    data: fromJS(data)
  }
}

export const fetchSingerDetail: ActionThunk = (payload) => {
  return (dispatch) => {
    requestSingerDetail(payload).then(({ data }) => {
      if (data && data.success) {
        dispatch(setSingerDetail(data.artist))
        dispatch(setHotSong(data.hotSongs.map((item: any) => {
          const singer = item.ar.map((item: {name: string}) => item.name).join('/')

          return {
            id: item.id,
            songName: item.name,
            singer: singer,
            albumName: item.al.name,
            cover: item.al.picUrl,
            singersInfo: item.ar
          }
        })))
      }
    })
  }
}
