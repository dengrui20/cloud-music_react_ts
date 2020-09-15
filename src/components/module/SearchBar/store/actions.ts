import { fromJS } from 'immutable';
import utils from '../../../../utils/index'
import { requestHotSearch, requestSearchWord } from '../../../../request/requestMehtods'
import { ActionThunk, ActionType} from '../../../../store/types'
export const SET_SEARCH_HISTORY_LIST = 'searchBar/SET_SEARCH_HISTORY_LIST'
export const SET_HOT_SEATCH_LIST = 'searchBar/SET_HOT_SEATCH_LIST'
export const SET_SEATCH_LIST = 'searchBar/SET_SEATCH_LIST'
export const SET_FOCUSED = 'searchBar/SET_FOCUSED'

export const setFocused = (focus: boolean):ActionType => {
  return {
    type: SET_FOCUSED,
    data: focus
  }
}

export const setSearchHistoryList: ActionThunk = (searchKey: string | [], isList = false) => {
  return (dispatch, getState) =>  {
    let searchHistoryList = getState().getIn([ 'searchBar', 'searchHistoryList' ]).toJS()
    if (!isList) {
      if (!searchHistoryList.some((item:string) => item === searchKey && searchKey !== '')) {
        if (searchHistoryList.length > 8) {
          searchHistoryList.shift()
        }
        searchHistoryList.push(searchKey)
      } else {
        return
      }
    } else {
      searchHistoryList = searchKey
    }

    utils.storageSetSearchHistoryList(searchHistoryList)
    dispatch({
      type: SET_SEARCH_HISTORY_LIST,
      data: fromJS(searchHistoryList)
    })
  }
}

export const fetchHotSearchList: ActionThunk = () => {
  return (dispatch) =>  {
    requestHotSearch().then(({ data }) => {
      if (data && data.success) {
        dispatch({
          type: SET_HOT_SEATCH_LIST,
          data: fromJS(data.data)
        })
      }
    })
  }
}

export const fetchSearchList: ActionThunk = (word: string) => {
  return (dispatch) =>  {
    requestSearchWord(word).then(({ data }) => {
      if (data && data.success) {
        let searchResultList = []
        if (data.result.songs) {
          searchResultList = data.result.songs.map((result: any) => {
            return {
              name: result.name.replace(word, `<span style='color:#04BE02'>${word}</span>`),
              singer: (result.artists.map((item: {name: string}) => item.name).join('/') + '-' + result.album.name).replace(word, `<span style='color:#04BE02'>${word}</span>`),
              id: result.id
            }
          })
        }
        
        dispatch({
          type: SET_SEATCH_LIST,
          data: fromJS(searchResultList)
        })
      }
    })
  }
}
