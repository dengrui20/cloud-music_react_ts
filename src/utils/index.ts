import * as storage from './storage'

const filterPlayCount = (count:number): string => {
  if (count <= 10000) {
    return count.toString()
  } else {
    const playCount = count / 10000
    return (playCount.toFixed(0) ) + '万'
  }
}

export const pxTransformToVw = (px: number): number => {
  return px / 7.5
}

export const getSongUrl = (id: number | string) => {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
}

export const random = (min: number, max: number) => {
  return min + Math.floor((max - min) * Math.random())
}

export const formatPlayTime = (time: number) => {
  if (!time) {
    return '00:00'
  }
  const min = Math.floor(time / 60)
  const minStr = min < 10 ? '0' + min : min
  const sec = Math.floor(time % 60)
  const secStr = sec < 10 ? '0' + sec : sec

  return minStr + ':' + secStr
}

export const parseLyric = (lrc: string) => {
  const matchLrcReg = /\[([0-9]+:[0-9.]+)\]([\S | \s]{0,})$/g
  let result: any = []
  const lyrics = lrc.split('\n')
  console.log(lyrics)
  if (lyrics) {
    result = lyrics.map((item) => {
      const time = item.replace(matchLrcReg, '$1').replace(/\[|\]/g, '')
      const lrc = item.replace(matchLrcReg, '$2')
      const timeStamp = (parseFloat(time.split(':')[0]) * 60 + parseFloat(time.split(':')[1])) * 1000
      return {
        time:  time,
        timeStamp: Number(timeStamp.toFixed(1)),
        lrcText: lrc
      }
    })

    result = result.filter((item: any) => item.lrcText.trim().length !== 0)
  }

  console.log(result)
  
  return result
}

const utils = {
  filterPlayCount,
  pxTransformToVw,
  getSongUrl,
  random,
  ...storage
}

export default utils
