export type SearchHistoryListType = string[]
export interface HotSearch {
  searchWord: string
  iconUrl?: string
  content: string
}

export interface SearchResult {
  name: string,
  singer: string,
  id: string
}

export interface SearchBarInitState {
  searchHistoryList:SearchHistoryListType,
  hotSearchList: HotSearch[]
  searchResultList: SearchResult[]
  focused: boolean
}