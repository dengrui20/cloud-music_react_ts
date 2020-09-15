import { fromJS } from 'immutable';
import { requestSingerList } from '../../../request/requestMehtods';
import { Toast } from 'antd-mobile'
import { ActionThunk, ActionType } from "../../../store/types";

export const SET_SINGER_LIST = 'singer/SET_SINGER_LIST'
export const SET_FETCHING = 'singer/SET_FETCHING'
export const SET_SINGER_TYPE = 'singer/SET_SINGER_TYPE'
export const SET_SINGER_AREA = 'singer/SET_SINGER_AREA'

export const setSingerList = (data = { result: [], page: 0 }): ActionType => {
  return {
    type: SET_SINGER_LIST,
    data: fromJS({ data: data.result, page: data.page })
  }
}

export const setFetching = (isFetching = false): ActionType => {
  return {
    type: SET_FETCHING,
    data: isFetching
  }
}

export const setSingerType = (type: number): ActionType => {
  return {
    type: SET_SINGER_TYPE,
    data: type
  }
}

export const setSingerArea = (area: number): ActionType => {
  return {
    type: SET_SINGER_AREA,
    data: area
  }
}

export const fetchSingerList: ActionThunk = (payload = { limit: 10, offset: 0, type: -1, area: -1 }) => {
  return (dispatch, getState) => {
    const singer = getState().getIn([ 'singer', 'singerList' ]).toJS()
    const { singerType, singerArea, isFetching } = getState().get('singer').toJS()

    // 防止重复请求
    if (isFetching) return
    dispatch(setFetching(true))
    const offset = singer.page * payload.limit
    const type = singerType === -1 ? '' : singerType
    const area = singerArea === -1 ? '' : singerArea

    Toast.loading('loading');
    requestSingerList({
      offset,
      type,
      area
    }).then((res) => {
      if (res.data && res.data.success) {
        const newResult = res.data.artists.map((item: any) => {
          if (item.alias.length > 0) {
            item.aliasName = ' (' + item.alias.join(',') + ')'
          }
          return item
        })
        dispatch(setSingerList({ result: singer.data.concat(newResult), page: ++ singer.page }))
      }
    }).finally(() => {
      Toast.hide()
      if (singer.page > 10 ) {
        // 最多显示10页数据
        return
      }
      setTimeout(() => {
        // 请求节流
        dispatch(setFetching(false))
      }, 300)
    })
  }
}
