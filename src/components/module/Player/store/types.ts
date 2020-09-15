
export enum playMode {
  random = 'random',
  loop = 'loop',
  single = 'single'
}

export interface SongInfo {
  songName: string
  id: number,
  singer: string,
  cover: string
  albumName: string,
  singersInfo: Array<{ name: string, id: number, [key: string]: any }>
  [key: string]: any
}

export interface Lyric {
  time: string
  lrcText: string
  timeStamp: number
}

export interface PlayerInitState {
  fullScreen: boolean
  playList: []
  currentTime: number
  playMode: playMode
  currentSong: {}
  showPlayList: boolean
  isPlaying: boolean
  process: number
  lyrics: Lyric[]
}

