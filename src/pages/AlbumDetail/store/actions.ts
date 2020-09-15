import { fromJS } from 'immutable';
import { requestAlbumList } from '../../../request/requestMehtods';
import { ActionThunk, ActionType } from "../../../store/types";
import { AlbumDetail } from './types'
import { SongInfo } from '../../../components/module/Player/store/types'
import utils from '../../../utils'

export const SET_ALBUM_LIST = 'album/SET_ALBUM_LIST'
export const SET_ALBUM_DETAIL = 'album/SET_ALBUM_DETAIL'

export const setAlbumList = (data: SongInfo[]): ActionType => {
  return {
    type: SET_ALBUM_LIST,
    data: fromJS(data)
  }
}

export const setAlbumDetail = (data: AlbumDetail): ActionType => {
  return {
    type: SET_ALBUM_DETAIL,
    data: fromJS(data)
  }
}


export const fetchAlbumDetai: ActionThunk = (id: number = -1) => {
  return (dispatch) => {
    requestAlbumList(id).then(({ data }) => {
      if (data && data.success) {
        const albumDetail: AlbumDetail = {
          cover: data.playlist.coverImgUrl,
          name: data.playlist.name,
          listenCount: utils.filterPlayCount(data.playlist.playCount),
          avatar: data.playlist.creator.avatarUrl,
          person: data.playlist.creator.nickname,
          collect: utils.filterPlayCount(data.playlist.subscribedCount)
        }

        const songList: SongInfo[] = data.playlist.tracks.map((item: any) => {
          return {
            songName: item.name,
            id: item.id,
            singer: item.ar.map((item: { name: string }) => item.name).join('/'),
            albumName: item.al.name,
            cover: item.al.picUrl,
            singersInfo: item.ar
          }
        })
        dispatch(setAlbumDetail(albumDetail))
        dispatch(setAlbumList(songList))
      }
    })
  }
}
