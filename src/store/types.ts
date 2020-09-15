import { ThunkDispatch } from 'redux-thunk'
export type ThunkDispatchType = ThunkDispatch<{}, {} , { type: any }>
export type ThunkGetStateType = () => any
export type ActionThunk = (payload?: any, param?: any) => (dispatch: ThunkDispatchType, getState: ThunkGetStateType) => any
export interface ActionType {
  type: string,
  data?: any
}

export interface SingerType {
  id: number,
  text: string
}
