import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import style from './searchBar.module.scss'
import classnames from 'classnames'
import { createPortal } from 'react-dom'
import { getIn } from 'immutable'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchHistoryList, fetchHotSearchList, fetchSearchList, setFocused } from './store/actions'
import Scroll, { BScrollType } from '../../common/Scroll'
import { SearchResult } from './store/types'
import { useDebounce } from '../../../utils/hooks'
import Player from '../Player'
import { setPlayList } from '../Player/store/actions'
import { SongInfo } from '../Player/store/types'
import { requestSongDetail } from '../../../request/requestMehtods'



const SearchResultList = memo(() => {
  const { searchResultList } = useSelector(state => getIn(state, ['searchBar'], '').toJS())

  const dispatch = useDispatch()
  const searchResultScrollRef = useRef<BScrollType>()

  useEffect(() => {
    searchResultScrollRef.current && searchResultScrollRef.current.refresh()
  }, [searchResultList])

  const play = (item: SearchResult) => {
    requestSongDetail(item.id).then(({ data }) => {
      if (data && data.success) {
        const song = data.songs[0]
        const songInfo: SongInfo = {
          songName: song.name,
          id: song.id,
          singer: song.ar.map((item: { name: string }) => item.name).join('/'),
          albumName: song.al.name,
          cover: song.al.picUrl,
          singersInfo: song.ar
        }
        dispatch(setPlayList(songInfo))
      }
    })
  }
  return (
    <Scroll className={style['search-result-container']} ref={searchResultScrollRef}>
      <div>
        <ul className={style['search-result-list']}>
          {
            searchResultList.map((result: any) => {
              return (
                <li className={style['result-item']} key={result.id} onClick={() => play(result)}>
                  <div className={style['name']} dangerouslySetInnerHTML={{ __html: result.name }}></div>
                  <div className={style['singer']} dangerouslySetInnerHTML={{ __html: result.singer }}></div>
                </li>
              )
            })
          }
        </ul>
      </div>
    </Scroll>

  )
})


/* 搜索历史列表 */
const SearchHistory = memo(() => {
  const searchHistoryList: string[] = useSelector((state) => getIn(state, ['searchBar', 'searchHistoryList'], '').toJS())
  const dispatch = useDispatch()
  const clearHistoryList = useCallback(() => {
    dispatch(setSearchHistoryList([], true))
  }, [])

  if (searchHistoryList.length === 0) return null
  return (
    <div className={style['search-history']}>
      <h3 className={style['module-title']}>
        <span>搜索历史</span>
        <div className={style['icon-delete']} onClick={clearHistoryList}>
          <i className='iconfont'>&#xe601;</i>
        </div>
      </h3>
      <ul className={style['history-list-container']}>
        {
          searchHistoryList.map((key) => {
            return <li>{key}</li>
          })
        }
      </ul>
    </div>
  )
})

interface HotSearch {
  searchWord: string
  iconUrl?: string
  content: string
  [key: string]: any
}

/* 热门搜索 */
const HotSearch: React.FC<{ changekeyAndSearch: (key: string) => void }> = memo((props) => {
  const hotSearchList = useSelector((state) => getIn(state, ['searchBar', 'hotSearchList']).toJS())
  const dispatch = useDispatch()
  const { changekeyAndSearch } = props
  useEffect(() => {
    hotSearchList.length === 0 && dispatch(fetchHotSearchList())
  }, [])

  return (
    <div className={style['hot-search']}>
      <h3 className={style['module-title']}>热搜榜</h3>
      <ul className={style['hot-seatch-list']}>
        {
          hotSearchList.map((hotSearch: HotSearch, index: number) => {
            return <HotSearchListItem key={hotSearch.searchWord} index={index + 1} hotSearch={hotSearch} changekeyAndSearch={changekeyAndSearch} />
          })
        }
      </ul>
    </div>
  )
})


/* 热门搜索列表 */
const HotSearchListItem: React.FC<{ hotSearch: HotSearch, changekeyAndSearch: (key: string) => void, index: number }> = memo((props) => {
  const { hotSearch, index, changekeyAndSearch } = props
  const searchHotWord = useCallback(() => {
    // dispatch(setSearchHistoryList(hotSearch.searchWord))
    console.log('change:', hotSearch.searchWord)
    changekeyAndSearch(hotSearch.searchWord)
  }, [])
  return (
    <li className={style['hot-search-list-item']} onClick={searchHotWord}>
      <div className={classnames(style['rank-count'], { [style['red']]: index <= 4 })}> {index} </div>
      <div className={style['info']}>
        <div className={style['search-word']}>
          <p className={style['word']}>{hotSearch.searchWord}</p>
          <SearchHotIcon iconUrl={hotSearch.iconUrl} />
        </div>
        <p className={style['desc']}>{hotSearch.content}</p>
      </div>
    </li>
  )
})

/* 热门搜索图标 */
const SearchHotIcon: React.FC<{ iconUrl: HotSearch['iconUrl'] }> = memo((props) => {
  const { iconUrl = '' } = props

  return (
    <img className={style['search-hot-icon']} src={iconUrl} alt="" />
  )
})


const SearchBar: React.FC = () => {
  const [searchKey, setSearchKey] = useState('')
  const { hotSearchList, focused } = useSelector(state => getIn(state, ['searchBar'], '').toJS())
  const { playList } = useSelector(state => getIn(state, ['player'], '').toJS())

  const scrollRef = useRef<BScrollType>()

  const dispatch = useDispatch()
  const getSearchKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value.trim())
  }

  const cancel = useCallback(() => {
    setSearchKey('')
    dispatch(setFocused(false))
  }, [])

  const changekeyAndSearch = useCallback((key) => {
    setSearchKey(key)
    dispatch(fetchSearchList(key))
  }, [])


  // search word
  /*  const searchSong = useCallback(() => {
     dispatch(setSearchHistoryList(searchKey))
   }, [searchKey]) */

  const searchKeyHandle = useDebounce(() => {
    searchKey && dispatch(fetchSearchList(searchKey))
  }, 300, [searchKey])

  useEffect(() => {
    searchKeyHandle && searchKeyHandle(searchKey)
  }, [searchKey])

  // scroll refresh
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.refresh()
    }
  }, [hotSearchList])


  return (
    <div className={classnames(style['search-bar'], { [style['focused']]: focused })}>
      <div className={style['search-bar-container']}>
        <div className={style['title']}>
          推荐
        </div>
        <div className={style['input-wrap']} onFocus={() => dispatch(setFocused(true))} >
          <i className="iconfont">&#xe600;</i>
          <input
            className={style['search-input']}
            value={searchKey}
            type="text"
            placeholder="请输入搜索内容"
            onChange={getSearchKey}
          />
          <span className={style['search']}></span>
          <div className={style['cancel']} onClick={cancel} >
            取消
          </div>
        </div>
        <div className={style['mini-player']}>
          {
            playList.length > 0 ? <Player /> : <i className="iconfont">&#xe683;</i>
          }
        </div>
      </div>

      {focused && searchKey !== '' ?
        createPortal(<SearchResultList />, document.body) : null
      }

      {
        createPortal(<Scroll className={classnames(style['search-about'], {[style['active']]: focused})} ref={scrollRef}>
          <div>
            {/* <SearchHistory/> */}
            <HotSearch changekeyAndSearch={changekeyAndSearch} />
          </div>
        </Scroll>, document.body)
      }
    </div>
  )
}

export default memo(SearchBar)
