import { fromJS } from 'immutable';
import { requestRanks  } from '../../../request/requestMehtods';
import { ThunkDispatchType, ActionType } from '../../../store/types'
import { Rank } from './types'


export const SET_OFFICIAL_LIST = 'ranks/SET_OFFICIAL_LIST'
export const SET_GLOBAL_LIST = 'ranks/SET_GLOBAL_LIST'

export const setOfficialList = (data:Rank[] = []): ActionType => {
  return {
    type: SET_OFFICIAL_LIST,
    data: fromJS(data)
  }
}

export const setGlobalList = (data:Rank[] = []): ActionType => {
  return {
    type: SET_GLOBAL_LIST,
    data: fromJS(data)
  }
}

export const fetchRanksList = () => {
  return (dispatch: ThunkDispatchType) => {
    requestRanks().then(({ data }) => {
      if (data && data.success) {
        const officialList = data.list.slice(0, 4)
        const globalList = data.list.slice(4)
        dispatch(setOfficialList(officialList))
        dispatch(setGlobalList(globalList))
      }
    })
  }
}
