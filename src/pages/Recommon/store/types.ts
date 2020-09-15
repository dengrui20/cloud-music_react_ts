import { SongInfo } from '../../../components/module/Player/store/types'

export interface RecommonSong {
  playCount: number | string
  picUrl: string
  name: string
  id: number
}




export interface Banner { 
  pic: string 
}

export interface RecommonInitState {
  bannerList: Banner[]
  recommonList: RecommonSong[]
  newSongList:  SongInfo[]
}
