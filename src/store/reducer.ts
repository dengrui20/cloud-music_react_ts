import { combineReducers } from 'redux-immutable'
import recommon from '../pages/Recommon/store'
import searchBar from '../components/module/SearchBar/store'
import player from '../components/module/Player/store'
import singer from '../pages/Singer/store'
import ranks from '../pages/Ranks/store'
import singerDetail from '../pages/SingerDetail/store'
import albumDetail from '../pages/AlbumDetail/store'
import staticData from './staticData'
export default combineReducers({
  recommon,
  searchBar,
  singer,
  ranks,
  staticData,
  singerDetail,
  albumDetail,
  player
})
