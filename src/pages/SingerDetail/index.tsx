import React, { memo, useEffect, useCallback, useRef, RefObject } from 'react'
import HeaderBar from '../../components/common/HeaderBar'
import style from './singerDetail.module.scss'
import { fetchSingerDetail } from './store/actions'
import { useDispatch, useSelector } from 'react-redux'
import Scroll, { scrollEvent } from '../../components/common/Scroll'
import { useRouteMatch } from 'react-router-dom'
import { getIn } from 'immutable'
import AlbumListContainer from '../../components/container/AlbumListContainer'
import Player from '../../components/module/Player/index'

function SingerDetail() {
  const match = useRouteMatch<{ id: string }>()
  const { singerDetail, hotSongList } = useSelector((state) => getIn(state, ['singerDetail'], '').toJS())
  const dispatch = useDispatch()
  const coverRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (match.params.id) {
      dispatch(fetchSingerDetail({ id: match.params.id }))
    }
  }, []);

  // 图片放大
  const scroll: scrollEvent = useCallback((pos) => {
    let scale = (pos.y / 250) + 1
    scale = scale > 1 ? scale : 1
    if (coverRef.current) {
      coverRef.current.style.transform = `scale(${scale})`
    }   
  },[])
  return (
    <div className={style['singer-detail']}>
      <HeaderBar
        styles={{ color: 'white' }}
        className={style['header']}
        leftElement={singerDetail.name}
        hasBorder={false}
        rightElement={ <Player />}
      />
      <div className={style['singer-cover']} ref={ coverRef }
        style={{
          background: `url(${singerDetail.picUrl}) no-repeat center center / cover`
        }}
      />
      <Scroll className={ style['scroll'] } direction='horizental' listenEvents={{scroll: scroll }}>
        <div className={style['song-list']}>
          <AlbumListContainer songList={ hotSongList }/>
        </div>
      </Scroll>
    </div>
  )
}

export default memo(SingerDetail)