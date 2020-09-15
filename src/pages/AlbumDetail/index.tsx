import React, { memo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAlbumDetai } from './store/actions'
import { useParams } from 'react-router-dom'
import style from './AlbumDetail.module.scss'
import AlbumListContainer from '../../components/container/AlbumListContainer'
import Scroll from '../../components/common/Scroll'
import HeaderBar from '../../components/common/HeaderBar'
import Player from '../../components/module/Player/index'

import { getIn } from 'immutable'

const CollectionBtn = memo((props: {collectNum: string}) => {
  const { collectNum } = props
  return (
    <div className={style['collect']}>收藏({collectNum})</div>
  )
})

const AlbumDetail = memo(() => {
  const diapatch = useDispatch()
  const parma = useParams<{ id: string }>()
  const { albumDetail, albumList } = useSelector((state) => getIn(state, ['albumDetail'], '').toJS())
  const { playList} = useSelector((state) => getIn(state, ['player'], '').toJS())

  useEffect(() => {
    diapatch(fetchAlbumDetai(parma.id))
  }, [])
  return (
    <div className={style['album-detail']}>
      <HeaderBar
        styles={{ color: 'white' }}
        className={style['header']}
        hasBorder={false}
        title='歌单'
        rightElement={playList.length > 0 ? <Player /> : null}
      />
      <div className={style['bg-blur']} style={{ backgroundImage: `url(${albumDetail.cover})`, backgroundPosition: 'center' }}></div>

      <Scroll className={style['scroll']} direction='horizental'>
        <div className={style['song-list']}>
          <div className={style['album-info']}>
            <div className={style['album-cover']}>
              <img className={style['album-cover-img']} src={albumDetail.cover} alt="" />
              <div className={style['play-count']}>
                <i className='iconfont'>&#xe72c;</i>
                {albumDetail.listenCount}
              </div>
            </div>

            <div className={style['info-desc']}>
              <p className={style['album-name']}>{albumDetail.name}</p>
              <div className={style['person']}>
                <img className={style['avatar']} src={albumDetail.avatar} alt="" />
                <span className={style['person-name']}>{albumDetail.person}</span>
              </div>
            </div>
          </div>
          <AlbumListContainer songList={albumList}  headerRightElement={<CollectionBtn collectNum={albumDetail.collect}/>}/>
        </div>
      </Scroll>
    </div>
  )
})

export default AlbumDetail