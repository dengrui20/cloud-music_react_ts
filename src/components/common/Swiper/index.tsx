import React, { memo, useRef, useEffect } from 'react';
import Swiper, { SwiperOptions, SwiperEvent } from 'swiper'
import 'swiper/css/swiper.min.css'
import classnames from 'classnames'

export type SwiperEvents<T> = {
  [key in SwiperEvent]?: (...rest: T[]) => void
}

export interface SwiperProps {
  autoplay?: boolean
  effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip'
  speed?: number
  showPagination?: boolean
  list?: any[],
  slidesPerView?: number
  centeredSlides?: boolean,
  loop?: boolean
  direction?: "horizontal" | "vertical" | undefined
  className?: string,
  children: JSX.Element[],
  mapKey?: string,
  listenEvents?: SwiperEvents<Swiper | undefined>
}


const SwiperComponents: React.FC<SwiperProps> = (props) => {

  const {
    autoplay = true,
    effect = 'slide',
    speed = 300,
    showPagination = true,
    list = [],
    listenEvents = {},
    slidesPerView = 1,
    centeredSlides = true,
    loop = false,
    children = [],
    mapKey = 'key',
    direction = 'horizontal',
    className = ''
  } = props
  const swiperRef = useRef(document.createElement('div'))
  const swiperInstance = useRef<Swiper>()
  useEffect(() => {
    // 初始化配置项
    const options: SwiperOptions = {
      // 循环
      loop: loop,
      // 设定初始化时slide的索引
      initialSlide: 0,
      effect: effect,
      // 自动播放
      autoplay: autoplay,
      // 滑动速度
      speed: speed,
      // 滑动方向
      direction: direction,
      // 小手掌抓取滑动
      grabCursor: true,

      // 分页器设置
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        type: 'bullets'
      },
      centeredSlides: centeredSlides,
      slidesPerView: slidesPerView,
      on: {}
    }

    // 动态绑定事件
    let BindEventObj: SwiperEvents<undefined> = {}
    for (let key in listenEvents) {
      BindEventObj[key as SwiperEvent] = () => {
        listenEvents[key as SwiperEvent]!(swiperInstance.current)
      }
    }

    options.on = BindEventObj

    // 初始化swiper
    if (swiperRef.current && list.length > 0) {
      swiperInstance.current = new Swiper(swiperRef.current, options)
    }
  }, [])

  return (
    <div className={classnames(['swiper-component', 'swiper-container', className])} ref={swiperRef}>
      <div className="swiper-wrapper">
        {children.map((listItem, index) => {
          return (
            <div className="swiper-slide" key={ list[index][mapKey] }>
              { listItem }
            </div>
          )
        })}
      </div>
      {showPagination && <div className="swiper-pagination" />}
    </div>
  )
}

export default memo(SwiperComponents)
