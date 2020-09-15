export interface Tracks {
  first: number
  second: number
}

export interface Rank {
  frequency: string
  coverImgUrl: string
  tracks: Tracks[]
  id: number
  updateFrequency?: string
}

export interface RankInitState {
  officialList: Rank[]
  globalList: Rank[]
}