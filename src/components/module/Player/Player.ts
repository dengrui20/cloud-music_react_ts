import { getSongUrl, random } from '../../../utils/index'
import { SongInfo, playMode } from './store/types'
export const defaultCurrentSong = {
  songName: '',
  id: -1,
  singer: '',
  cover: '',
  albumName: '',
  singersInfo: [],
}
class Player {
  audio: HTMLAudioElement
  private _playList: SongInfo[] = []
  private _playHistory: SongInfo[] = []
  _isPlaying = false
  playMode: playMode = playMode.loop
  private _currentSong: SongInfo = defaultCurrentSong
  constructor(selectorId?: string) {
    let audio = document.getElementById(selectorId || '')
    if (audio instanceof HTMLAudioElement) {
      this.audio = audio
    } else {
      const newAudio = document.createElement('audio')
      newAudio.id = 'audio'

      audio = newAudio
      this.audio = newAudio
    }
    document.body.append(audio)

    this.audio.addEventListener('error', () => {
      console.log('error')
    })

    this.audio.addEventListener('canplay', () => {
      console.log('canplay')

    })

    this.audio.addEventListener('load', () => {
      console.log('load')
    })

    this.audio.addEventListener('loadstart', () => {
      console.log('loadstart')
    })
  }
  get isPlaying() {
    return this._isPlaying
  }
  set isPlaying(play: boolean) {
    play ? this.audio.play() : this.audio.pause()
    this._isPlaying = play
  }
  get playList() {
    return this._playList
  }
  get currentSong() {
    return this._currentSong
  }
  // 播放
  private _play(id: number) {
    // 判断需要播放的音乐是否是当前音乐
    const isPlayingCurrent = this._currentSong.id === id
    if (isPlayingCurrent) {
      // 如果当前音乐正在播放或暂停 直接重新播放
      this.reloadMusic()
    } else {
      // 如果 需要播放的音乐不是当前音乐 选中当前音乐后播放
      this._currentSong = this._playList.filter((song) => song.id === id)[0]
      this.audio.src = getSongUrl(id)
      this.audio.autoplay = true
    }
  }
  // 添加音乐
  addMusic(music: SongInfo[] | SongInfo) {
    if (Array.isArray(music)) {
      if (music.length === 0) {
        return
      }
      this._playList = music
      this._play(music[0].id)
      // 清空播放历史
      this._playHistory = [ music[0] ]
    } else if (music.id) {
      if (!this._playList.some(song => song.id === music.id)) {
        // 如果播放列表没有这首歌  直接添加到播放列表后再播放
        // 如果已经存在 则直接播放
       
        this._playList.push(music)
        if (!this.isPlayed(music)) {
          //如果没有播放过
          this._playHistory.push(music)
        }
      }
      this._play(music.id)
    }

  }
  reloadMusic () {
    this.audio.currentTime = 0
    this.audio.play()
  }
  // 下一首
  next() {
    let currentIndex = this._playList.findIndex(song => song.id === this._currentSong.id)

    if (this.playMode === playMode.loop) {
      // 如果是顺序播放
      currentIndex = currentIndex + 1 > this._playList.length - 1 ? 0 : currentIndex + 1
      this.addMusic(this._playList[currentIndex])
    }

    if (this.playMode === playMode.single) {
      // 如果是单曲循环 播放时间直接归0 重新播放
      this.reloadMusic()
    }

    if (this.playMode === playMode.random) {
      // 如果是随机播放
      // 找出还没有播放过的歌曲 随机播放一首
      let notPlayed = this._playList.filter((song) => {
        return !this.isPlayed(song)
      })

      if (notPlayed.length <= 0) {
        // 如果所有歌曲都播放完
        notPlayed = this._playList
        // 清空播放历史
        this._playHistory = []
      }

      const currentSong = notPlayed[random(0, notPlayed.length)]
      this._playHistory.push(currentSong)
      this.addMusic(currentSong)
    }

    // 添加到播放历史
    if (this.isPlayed(this._playList[currentIndex])) {
      // 如果播放历史已存在当前歌曲
      return
    }
    this._playHistory.push(this._playList[currentIndex])
  }
  isPlayed(song: SongInfo) {
    return this._playHistory.some(playedSong => playedSong.id === song.id)
  }
  changePlayMode(playMode: playMode) {
    // 清空历史 并且把当前歌曲放入播放历史
    this.playMode = playMode
    this._playHistory = [this._currentSong]
  }
  // 上一首
  prev() {
    let currentIndex = this._playList.findIndex(song => song.id === this._currentSong.id)

    if (this.playMode === playMode.loop) {
      // 如果是顺序播放
      currentIndex = currentIndex - 1 < 0 ? this._playList.length - 1 : currentIndex - 1
      this.addMusic(this._playList[currentIndex])
    }

    if (this.playMode === playMode.single) {
      // 如果是单曲循环
      this.audio.currentTime = 0
    }

    if (this.playMode === playMode.random) {
      // 如果是随机播放
      let currentSont = this._playHistory[this._playHistory.length - 2]
      if (!currentSont) {
        // 如果上一曲不存在 从歌曲列表随机选择一首
        currentSont = this._playList[random(0, this._playList.length)]
        this._playHistory = [ currentSont ]
      } else {
        this._playHistory = this._playHistory.slice(0, this._playHistory.length - 1)
      }
      this.addMusic(currentSont)
    }
  }
  deleteMusic (song:SongInfo) {
    this._playList = this._playList.filter(currentSong => currentSong.id !== song.id)
    this._playHistory = this._playHistory.filter(currentSong => currentSong.id !== song.id)
    if (!this._playList.length) {
      // 如果最后一首歌曲被删除了
      // 停止当前歌曲播放
      this.isPlaying = false
      this._currentSong = defaultCurrentSong
    }

    if (song.id === this._currentSong.id) {
      // 如果当前播放的歌曲被删除了 直接播放下一首
      this.next()
    }
  }
  deleteAllMusic () {
    this._playList = []
    this._playHistory = []
    // 全部清空 停止当前歌曲播放
    this.isPlaying = false
    this._currentSong = defaultCurrentSong
  }
}

export default new Player()