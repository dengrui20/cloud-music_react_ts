import React, { memo, useEffect, useState, useRef, useCallback } from 'react'
import style from './player.module.scss'
import classnames from 'classnames'
import { createPortal } from 'react-dom'
import { setFullScreen, setPlayList, setPlayMode, setIsPlaying, nextMusic, prevMusic, deleteMusic, deleteAllMusic, setShowPlayList } from './store/actions'
import { useDispatch, useSelector } from 'react-redux'
import { getIn } from 'immutable'
import playerInstance from './Player'
import { formatPlayTime } from '../../../utils/index'
import { playMode as playModes, SongInfo, Lyric } from './store/types'
import { CSSTransition } from 'react-transition-group'
import Scroll from '../../common/Scroll/index'
import BScroll from 'better-scroll'

/* 进度环 */
const Circle: React.FC<{ process: number }> = (props) => {
  const process = props.process
  const length = Math.PI * 56
  const Vw = (px: number) => {
    return px * (document.body.clientWidth / 750)
  }
  return (
    <svg className={style['circel']} xmlns="http://www.w3.org/2000/svg" version="1.1">
      <circle
        cx="50%"
        cy="50%"
        r={Vw(28)}
        stroke="#aaa"
        opacity='0.3'
        strokeWidth={Vw(3)} fill="transparent"
      />
      <circle
        cx="50%"
        cy="50%"
        r={Vw(28)}
        stroke="red"
        strokeWidth={Vw(3)} fill="transparent"
        strokeDasharray={Vw(length)}
        strokeDashoffset={Vw(length * (1 - process / 100)) ? Vw(length * (1 - process / 100)) : 0}
      />
    </svg>
  )
}

/* 控制器 */
const PlayerController: React.FC<{ process: number }> = memo((props) => {
  const { isPlaying, playMode } = useSelector((state) => getIn(state, ['player'], '').toJS())
  const process = props.process
  const dispatch = useDispatch()
  const [isTouchStart, setIsTouchStart] = useState(false)
  const BtnRef = useRef<HTMLDivElement>(null)
  const processRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // 更新音乐进度
  useEffect(() => {
    // console.log(currentProcess)

    if (!BtnRef.current || !progressRef.current) return
    if (!isTouchStart) {
      BtnRef.current.style.left = process + '%'
      progressRef.current.style.width = process + '%'
    }
  }, [isTouchStart, process])


  // 进度条拖拽
  useEffect(() => {
    const moveHandle = (e: TouchEvent) => {
      if (!processRef.current || !BtnRef.current || !progressRef.current) return
      if (isTouchStart) {
        let diffX = 0
        diffX = e.targetTouches[0].clientX - processRef.current.offsetLeft
        diffX = diffX < 0 ? 0 : diffX
        const maxDiff = processRef.current.clientWidth
        diffX = diffX > maxDiff ? maxDiff : diffX
        BtnRef.current.style.left = (diffX / maxDiff) * 100 + '%'
        progressRef.current.style.width = (diffX / maxDiff) * 100 + '%'
      }
    }
    const touchEndHandle = () => {
      if (BtnRef.current && isTouchStart) {
        // alert(Math.floor(playerInstance.audio.duration * Number(BtnRef.current.style.left.replace('%', '')) / 100))
        playerInstance.audio.currentTime = Math.floor(playerInstance.audio.duration * Number(BtnRef.current.style.left.replace('%', '')) / 100)
      }
      // 控制按钮闪烁问题
      const timer = setTimeout(() => {
        setIsTouchStart(false)
        clearTimeout(timer)
      }, 100)
    }
    if (BtnRef.current && progressRef.current) {
      document.body.addEventListener('touchmove', moveHandle)
      document.body.addEventListener('touchend', touchEndHandle)
    }
    return () => {
      document.body.removeEventListener('touchmove', moveHandle)
      document.body.removeEventListener('touchend', touchEndHandle)

    }
  }, [isTouchStart])

  const touchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsTouchStart(true)
  }

  // 切换播放模式
  const changeMode = useCallback(() => {
    const modes = [playModes.loop, playModes.single, playModes.random]
    let currentIndex = modes.indexOf(playMode) + 1
    let actMode = modes[currentIndex] ? modes[currentIndex] : modes[0]
    dispatch(setPlayMode(actMode))
  }, [playMode])

  const playModeIcon = () => {
    switch (playMode) {
      case playModes.loop:
        return '&#xe66c;'
      case playModes.single:
        return '&#xe66d;'
      case playModes.random:
        return '&#xe60a;'
    }
    return ''
  }
  return (
    <div className={style['player-controller']}>
      <div className={style['process-container']}>
        <span className={style['play-time']}>
          {formatPlayTime(playerInstance.audio.currentTime)}
        </span>
        <div ref={processRef} className={style['process']}>
          <div ref={progressRef} className={style['progress']} />
          <div ref={BtnRef} className={style['progress-btn']} onTouchStart={touchStart} />
        </div>
        <span className={style['play-time']}>
          {formatPlayTime(playerInstance.audio.duration - playerInstance.audio.currentTime)}
        </span>
      </div>
      <div className={style['controller-btn']}>
        <i className={classnames('iconfont')} onClick={changeMode} dangerouslySetInnerHTML={{ __html: playModeIcon() }}></i>
        <i className={classnames('iconfont')} onClick={() => dispatch(prevMusic())}>&#xe6e1;</i>
        <i className={classnames('iconfont', style['play-btn'])} onClick={() => dispatch(setIsPlaying(!playerInstance.isPlaying))}>
          {isPlaying ? <>&#xe63a;</> : <em style={{ position: 'relative', left: '2vw' }}>&#xe61e;</em>}
        </i>
        <i className={classnames('iconfont')} onClick={() => { dispatch(nextMusic()) }}>&#xe718;</i>
        <i className={classnames('iconfont')} onClick={() => dispatch(setShowPlayList(true))}>&#xe72f;</i>
      </div>
    </div>
  )
})

/* 播放列表 */
const PlayList = memo(() => {
  const { playList, currentSong, showPlayList, playMode } = useSelector((state) => getIn(state, ['player'], '').toJS())
  const dispatch = useDispatch()
  const close = () => dispatch(setShowPlayList(false))

  // 切换播放模式
  const changeMode = useCallback(() => {
    const modes = [playModes.loop, playModes.single, playModes.random]
    let currentIndex = modes.indexOf(playMode) + 1
    let actMode = modes[currentIndex] ? modes[currentIndex] : modes[0]
    dispatch(setPlayMode(actMode))
  }, [playMode])

  const playModeHtml = () => {
    switch (playMode) {
      case playModes.loop:
        return '&#xe66c;顺序播放'
      case playModes.single:
        return '&#xe66d;单曲播放'
      case playModes.random:
        return '&#xe60a;随机播放'
    }
    return ''
  }
  return (
    <>
      <CSSTransition in={showPlayList} classNames='fade' timeout={300}>
        <div className={style['play-list-mask']}
          onClick={close}
        />
      </CSSTransition>

      <CSSTransition in={showPlayList} classNames='moveTop' timeout={300}>
        <div className={style['play-list']}>
          <div className={style['play-list-title']}>
            当前播放({playList.length})
      </div>
          <div className={style['operation']}>
            <div className={style['play-mode'] + ' iconfont'} dangerouslySetInnerHTML={{ __html: playModeHtml() }} onClick={changeMode}>
            </div>

            <i className={style['delete-all'] + ' iconfont'} onClick={() => dispatch(deleteAllMusic())}>&#xe601;</i>
          </div>

          <Scroll className={style['scroll']} direction='horizental'>
            <ul className={style['song-list']}>
              {
                playList.map((song: SongInfo) => {
                  return (
                    <li
                      className={classnames(style['song'], { [style['current']]: currentSong.id === song.id })}
                      key={song.id}
                    >
                      <div className={style['song-name']} onClick={() => dispatch(setPlayList(song))}>
                        <i className={classnames('iconfont', style['iconfont'])}>&#xe662;</i>
                        {song.songName}
                      </div>
                      <i className={"iconfont " + style['delete']} onClick={() => dispatch(deleteMusic(song))}>&#xe686;</i>
                    </li>
                  )
                })
              }
            </ul>
          </Scroll>
          <div className={style['close']} onClick={close}>关闭</div>
        </div>
      </CSSTransition>
    </>
  )
})

/* 歌词 */

const LyricList: React.FC<{ process: number, showCd: () => void }> = memo((props) => {
  const { process, showCd } = props
  const { lyrics } = useSelector((state) => getIn(state, ['player'], '').toJS())
  const [currentIndex, setCurrentIndex] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)
  const scrollRef = useRef<BScroll>(null)
  const timeOutFlag = useRef<any>(null)
  const [isScroll, setIsScroll] = useState(false)
  const currentTime = (playerInstance.audio.duration * (process / 100)) * 1000
  useEffect(() => {
    if (!lyrics.length) return
    // 查询当前选中歌词下标
    let currentIndex = lyrics.findIndex((lrc: Lyric) => lrc.timeStamp > currentTime)
    currentIndex = currentIndex - 1
    setCurrentIndex(currentIndex)

    // 自动跳转到当前选中的歌词
    if (listRef.current && scrollRef.current && listRef.current.children[currentIndex] && !isScroll) {
      scrollRef.current.scrollToElement(
        listRef.current.children[currentIndex] as HTMLElement,
        500,
        false,
        -100
      )
      // scrollRef.current.
    }
  }, [process]);

  // 滑动的时候修改标识 防止滑动时 自动定位到选中歌词
  const scrollStart = useCallback(() => {
    if (timeOutFlag.current) {
      clearTimeout(timeOutFlag.current)
    }
    setIsScroll(true)
  }, [])

  // 结束滑动修改标识 对用户操作滑动进行防抖处理
  const scrollEnd = useCallback(() => {
    if (timeOutFlag.current) {
      clearTimeout(timeOutFlag.current)
    }
    timeOutFlag.current = setTimeout(() => {
      setIsScroll(false)
    }, 1000)
  }, [])

  return (
    <Scroll
      className={style['lyric-list-container']}
      ref={scrollRef}
      listenEvents={{ scrollStart: scrollStart, scrollEnd: scrollEnd }}
    >
      <ul className={style['lyric-list']} ref={listRef} onClick={showCd}>
        {
          lyrics.length ?
            lyrics.map((ly: Lyric, index: number) => {
              return (
                <li
                  className={classnames(style['lyric-list-item'], { [style['active']]: currentIndex === index })}
                  key={ly.timeStamp}
                >
                  {ly.lrcText}
                </li>
              )
            }) :
            <li className={classnames(style['lyric-list-item'], style['not-lyric'])}>
              暂无歌词
            </li>
        }
      </ul>
    </Scroll>
  )
})

/* 播放器界面 */
const PlayerDetail: React.FC<{ process: number }> = memo((props) => {
  const process = props.process
  const dispatch = useDispatch()
  const [showCd, setShowCd] = useState(true)
  const { currentSong, isPlaying } = useSelector((state) => getIn(state, ['player'], '').toJS())
  const toggleShowCd = useCallback(() => {
    console.log(showCd)
    setShowCd(!showCd)
  }, [showCd])

  return (
    <div className={style['player-detail']}>
      <div className={style['blur-bg']} style={{ backgroundImage: `url(${currentSong.cover})` }} />
      <div className={style['header']}>
        <i className='iconfont' onClick={() => dispatch(setFullScreen(false))}>&#xe602;</i>
        <div className={style['song-info']}>
          <span>{currentSong.songName}</span>
          <span className={style['singer']}>{currentSong.singer}</span>
        </div>
        <i />
      </div>

      {/* cd view*/}
      <CSSTransition in={showCd} classNames='fade' timeout={300}>
        <div className={style['cd-container']} onClick={toggleShowCd}>
          <img className={classnames(style['cd-needle'], { [style['isPlaying']]: isPlaying })} src={require('./img/needle.png')} alt="" />
          <div className={style['cd-circle']}>
            <img className={style['cd-cover']} src={currentSong.cover} alt="" />
          </div>
        </div>
      </CSSTransition>


      {/* controller */}
      <PlayerController process={process} />

      {/* playList */}
      <PlayList />

      {/* Lyric */}
      <CSSTransition in={!showCd} classNames='fade' timeout={300}>
        <LyricList process={process} showCd={toggleShowCd} />
      </CSSTransition>

    </div>
  )
})

const Player = memo(() => {
  const { currentSong, fullScreen } = useSelector((state) => getIn(state, ['player'], '').toJS())
  const [process, setProcess] = useState(0)
  // return null
  const dispatch = useDispatch()
  useEffect(() => {
    const playHandle = () => {
      console.log('playing')
      dispatch(setIsPlaying(true))
    }
    const upDateTimeHandle = () => {
      // console.log('timeupdate', playerInstance.audio.currentTime, Math.floor(playerInstance.audio.currentTime))
      const process = (playerInstance.audio.currentTime / playerInstance.audio.duration) * 100
      // console.log('歌曲进度',  (playerInstance.audio.currentTime / playerInstance.audio.duration) * 100)
      // 播放进度
      setProcess(process)
    }

    const musicEndHandle = () => {
      console.log('ended')
      dispatch(nextMusic())
    }

    const errorHandle = () => {
      alert('播放错误')
    }
    playerInstance.audio.addEventListener('timeupdate', upDateTimeHandle)
    playerInstance.audio.addEventListener('playing', playHandle)
    playerInstance.audio.addEventListener('ended', musicEndHandle)
    playerInstance.audio.addEventListener('error', errorHandle)
    return () => {
      playerInstance.audio.removeEventListener('playing', playHandle)
      playerInstance.audio.removeEventListener('timeupdate', upDateTimeHandle)
      playerInstance.audio.removeEventListener('ended', musicEndHandle)
      playerInstance.audio.removeEventListener('error', errorHandle)

    }
  }, [])

  return (
    <div className={style['player']}>
      <div className={style['mini-player']} onClick={() => {

        dispatch(setFullScreen(true))
      }}>
        <Circle process={process}></Circle>
        <img className={style['cover']} src={currentSong.cover} alt="" />
      </div>


      {
        createPortal(
          <CSSTransition in={fullScreen} classNames='showcd' timeout={500}>
            <PlayerDetail process={process} />
          </CSSTransition>
          , document.body)
      }


    </div>
  )
})

export default Player