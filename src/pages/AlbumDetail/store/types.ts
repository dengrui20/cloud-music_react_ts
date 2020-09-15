import { SongInfo } from '../../../components/module/Player/store/types'

export interface AlbumDetail {
  cover: string
  listenCount: string
  person: string
  name: string
  avatar: string
  collect: string
}

export interface AlbumInitState  {
  albumList: SongInfo[]
  albumDetail: AlbumDetail
}