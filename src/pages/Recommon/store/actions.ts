import { fromJS } from 'immutable';
import { requestBannerList, requestRecommonList, requestNewSongList } from '../../../request/requestMehtods';
import utils from '../../../utils'
import { ActionThunk, ActionType } from '../../../store/types'
import { SongInfo } from '../../../components/module/Player/store/types'

export const SET_BANNER_LIST = 'recommon/SET_BANNER_LIST'
export const SET_RECOMMON_LIST = 'recommon/SET_RECOMMON_LIST'
export const SET_NEWSONE_LIST = 'recommon/SET_NEW_LIST'

export const setBannerList = (data = []): ActionType => {
  return {
    type: SET_BANNER_LIST,
    data: fromJS(data)
  }
}

export const setRecommonList = (data = []): ActionType => {
  return {
    type: SET_RECOMMON_LIST,
    data: fromJS(data)
  }
}

export const setNewSongList = (data = []): ActionType => {
  return {
    type: SET_NEWSONE_LIST,
    data: fromJS(data)
  }
}

export const fetchBannerList: ActionThunk = (payload: { type: string| number }) => {
  return (dispatch) => {
    requestBannerList(payload).then(({ data }) => {
      if (data && data.success) {
        dispatch(setBannerList(data.banners))
      }
    })
  }
}


export const fetchRecomminList: ActionThunk = (payload: { limit: number }) => {
  return (dispatch) => {
    
    requestRecommonList(payload).then(({ data }) => {
      
      if (data && data.success) {
        const result = data.result.map((item: any) => {
          item.playCount = utils.filterPlayCount(item.playCount)
          return item
        })
        dispatch(setRecommonList(result))
      }
    })
  }
}

export const fetchNewSongList: ActionThunk = () => {
  return (dispatch) => {
    requestNewSongList().then(({ data }) => {
      if (data && data.success) {
        const result = data.result.map((item: any) => {
          const newSong: SongInfo = {
            id: item.id,
            songName: item.name,
            alias: item.song.alias.join(','),
            singer: item.song.artists.map((artist:any) => artist.name).join('/'),
            albumName: item.song.album.name,
            singersInfo: item.song.artists,
            cover: item.picUrl
          }
          return newSong
        })
        dispatch(setNewSongList(result))
      }
    })
  }
}
