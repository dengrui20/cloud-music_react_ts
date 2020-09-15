import React, { memo, useCallback } from 'react'
import classnames from 'classnames'
import propTypes from 'prop-types'
import style from './albumListContainer.module.scss'
import { SongInfo } from '../../module/Player/store/types'
import { setPlayList } from '../../module/Player/store/actions'
import { useDispatch } from 'react-redux'

const AlbumListItem = memo((props: { song: SongInfo, index: number }) => {
  const dispatch = useDispatch()
  const { song, index } = props
  const playMusic = useCallback(() => {
    dispatch(setPlayList(song))
  }, [])
  return (
    <li className={style['song-list-item']} onClick={ playMusic }>
      <div className={style['song-index']}> {index + 1} </div>
      <div className={style['song']}>
        <div className={style['song-name']}>{song.songName}</div>
        <div className={style['song-artist']}>{song.singer + ' — ' + song.albumName}</div>
      </div>
    </li>
  )
})



interface AlbumListContainerProps {
  className?: string
  playMusic?: () => void
  headerRightElement?: JSX.Element | string,
  songList: SongInfo[]
}
function AlbumListContainer(props: AlbumListContainerProps) {
  const { className = '', headerRightElement = '', songList = [] } = props
  const dispatch = useDispatch()
  const playAll = useCallback(() => {
    dispatch(setPlayList(songList))
  }, [songList])
  return (
    <div className={classnames(style['album-list-container'], className)}>
      <div className={style['container-header']}>
        <div className={style['header-left']} onClick={ playAll }>
          <i className='iconfont'>&#xe653;</i>
          播放全部
          <span className={style['song-num']}>(共{songList.length}首)</span>
        </div>
        
        {headerRightElement}
      </div>

      <ul className={style['song-list']}>
        {
          songList.map((song: SongInfo, index: number) => {
            return <AlbumListItem song={song} key={song.id} index={index} />
          })
        }
      </ul>
    </div>
  )
}

AlbumListContainer.propTypes = {
  className: propTypes.string,
  playAllMusic: propTypes.func
}

export default memo(AlbumListContainer)