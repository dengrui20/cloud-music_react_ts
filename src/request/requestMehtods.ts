import { axiosInstance } from './config';
import api from './api'

/* 首页接口 */
export const requestBannerList = (payload: { type: string | number }) => {
  return axiosInstance.get(api.bannerList, { params: { type: payload.type } })
}

export const requestRecommonList = (payload: { limit: number }) => {
  return axiosInstance.get(api.recommonList, { params: { limit: payload.limit } })
}

export const requestNewSongList = () => {
  return axiosInstance.get(api.newSongList)
}

/* 热搜 */

export const requestHotSearch = () => {
  return axiosInstance.get(api.hotSearch)
}

/* 歌手列表 */

export const requestSingerList = (payload: {}) => {
  return axiosInstance.get(api.singerList, { params: { ...payload } })
}

export const requestRanks = () => {
  return axiosInstance.get(api.ranks)
}

/* 歌手详情 */

export const requestSingerDetail = (payload: {}) => {
  return axiosInstance.get(api.singerDetail, { params: { ...payload } })
}

/* 歌单详情 */

export const requestAlbumList = (id: number) => {
  return axiosInstance.get(api.getAlbumList, { params: { id: id } })
}


/* 搜索 */

export const requestSearchWord = (word: string) => {
  return axiosInstance.get(api.searchWord, { params: { keywords: word }})
}

/* 查询歌曲详情 */
export const requestSongDetail = (ids: string) => {
  return axiosInstance.get(api.getSongDetail, { params: { ids: ids }})
}

/* 查询歌曲歌词 */
export const requestLyric = (id: number | string) => {
  return axiosInstance.get(api.getLyric, { params: { id: id }})
}

