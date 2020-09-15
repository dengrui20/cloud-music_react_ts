import React, { useEffect, memo, useCallback, useState, FC } from 'react';
import { fetchBannerList, fetchRecomminList, fetchNewSongList } from './store/actions';
import { setPlayList} from '../../components/module/Player/store/actions'
import { useDispatch, useSelector } from 'react-redux';
import SwiperComponents from '../../components/common/Swiper'
import style from './recommon.module.scss'
import SearchBar from '../../components/module/SearchBar';
import classnames from 'classnames'
import Scroll from '../../components/common/Scroll'
import utils from '../../utils'
import { getIn } from 'immutable'
import { useHistory } from 'react-router-dom'

import { RecommonSong, Banner } from './store/types'
import { SongInfo } from "../../components/module/Player/store/types";

type moduleTitleType = { title: string }
const ModuleTitle: FC<moduleTitleType> = memo((props) => {
  const { title } = props
  return (
    <div className={style['module-title']}>
      {title}
    </div>
  )
})



/* 推荐模块 */

type RecommonListType = { recommonList: RecommonSong[] }

const RecommonList: React.FC<RecommonListType> = memo((props) => {
  const { recommonList = [] } = props
  const [containerWidth, setContainerWitdh] = useState(0)
  useEffect(() => {
    setContainerWitdh(utils.pxTransformToVw(recommonList.length * 224))
  }, [recommonList.length])
  return (
    <>
      <ModuleTitle title={'热门推荐'} />
      <Scroll direction='vertical'>
        <ul className={style['recommon-list']} style={{ width: containerWidth + 'vw' }}>
          {
            recommonList.map((recommonSong) => {
              return <RecommonListItem song={recommonSong} key={recommonSong.id} />
            })
          }
        </ul>
      </Scroll>
    </>
  )
})



const RecommonListItem: React.FC<{ song: RecommonSong }> = memo((props) => {
  const { song } = props
  const history = useHistory()

  const seeAlbumDetail = useCallback(() => {
    history.push(`/albumdetail/${song.id}`)
  }, [])
  return (
    <li className={style['recommon-list-item']} onClick={seeAlbumDetail}>
      <div className={style['song-cover']}>
        <div className={style['listen-num']}>
          <i className={classnames('iconfont', style['icon-listen'])}>&#xe683;</i>
          {song.playCount}
        </div>
        <i className={classnames('iconfont', style['icon-play'])}>&#xe72c;</i>
        <img src={song.picUrl + '?param=300x300'} alt="" />
      </div>
      <p className={style['song-desc']}>
        {song.name}
      </p>
    </li>
  )
})

/* 新歌模块 */


type NewSongList = {
  newSongList: SongInfo[]
}

const NewSongList: React.FC<NewSongList> = memo((props) => {
  const { newSongList } = props
  return (
    <>
      <ModuleTitle title={'最新音乐'} />
      <ul className={style['new-song-list']}>
        {
          newSongList.map((newSong) => {
            return <NewSongListItem newSong={newSong} key={newSong.id} />
          })
        }
      </ul>
    </>
  )
})


const NewSongListItem: React.FC<{ newSong: SongInfo }> = memo((props) => {
  const { newSong } = props
  const dispatch = useDispatch()
  return (
    <li className={ classnames(style['new-song-list-item'])}  onClick={() => {
      dispatch(setPlayList(newSong))
    }}>
      <div className={style['song-info']}>
        <div className={style['song-name']}>
          {newSong.songName}
          {newSong.alias && <span className={style['song-alias']}> ( {newSong.alias} ) </span>}
        </div>
        <div className={style['song-artist']}>
          {newSong.singer + ' — ' + newSong.albumName}
        </div>
      </div>
      <div className={classnames('iconfont', style['icon-play'])} >&#xe653;</div>
    </li>
  )
})

function Recommon() {
  const dispatch = useDispatch()
  const { bannerList, recommonList, newSongList } = useSelector((state) => getIn(state, ['recommon'], '').toJS())
  const plateData = useSelector((state) => getIn(state, ['staticData', 'recommenPagePlateData'], '').toJS())
  const history = useHistory()
  useEffect(() => {
    bannerList.length === 0 && dispatch(fetchBannerList({ type: 2 }))
    recommonList.length === 0 && dispatch(fetchRecomminList({ limit: 10 }))
    newSongList.length === 0 && dispatch(fetchNewSongList())
  }, [])


  const enterTheme = useCallback((theme) => () => {
    history.push(theme.path)
  }, [])

  /* test */
  const clickBannerHandle = useCallback((swiperInstance) => {
    console.log('当前banner下标:', swiperInstance.realIndex)
  }, [])

  return (
    <div className={style['recommon']}>
      <SearchBar />
      <Scroll
        className={style['wrap']}
        direction='horizental'
      >
        <div className={style['scroll-container']}>
          {
            bannerList.length > 0 ? <SwiperComponents
              className={style['banner-list']}
              list={bannerList}
              mapKey={'pic'}
              loop={true}
              listenEvents={{ click: clickBannerHandle }}
            >
              {
                bannerList.map((banner: Banner) => {
                  return (
                    <img src={banner.pic} key={banner.pic} alt="" />
                  )
                })
              }
            </SwiperComponents> : null
          }

          <ul className={style['theme']}>
            {
              plateData.map((item: any) => {
                return (
                  <li key={item.text} onClick={enterTheme(item)}>
                    <div className={style['img-container']}>
                      <img src={item.imgUrl} alt="" />
                    </div>
                    <div className={style['text']}>{item.text}</div>
                  </li>
                )
              })
            }
          </ul>
          {
            recommonList.length > 0 ? <RecommonList recommonList={recommonList} /> : null
          }
          {
            newSongList.length ? <NewSongList newSongList={newSongList} /> : null
          }

          <p className={style['bottom-tip']}>已经到底啦...</p>
        </div>
      </Scroll>
    </div>
  )
}

export default memo(Recommon)