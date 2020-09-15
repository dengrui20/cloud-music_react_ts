import React, { useRef, useEffect, useState, memo, useImperativeHandle, forwardRef } from 'react';
import BetterScroll from 'better-scroll'
export enum PropTypeValues {
  probeType_1 = 1,
  probeType_2 = 2,
  probeType_3 = 3
}

export type BScrollType = BetterScroll

export type  scrollEvent  = (pos: { x: number, y: number }, maxY: number) => any



export interface Events {
  scrollEnd?: scrollEvent
  touchEnd?: scrollEvent
  scroll?: scrollEvent
  beforeScrollStart?: scrollEvent
  scrollStart?: scrollEvent
  scrollCancel?: scrollEvent
  pullingUp?: scrollEvent,
  flick?: scrollEvent
  refresh?: scrollEvent
  pullingDown?: scrollEvent
  destroy?: scrollEvent
  [key:string] : any
}



export interface Scroll {
  probeType?: PropTypeValues
  click?: boolean
  className?: string
  children: JSX.Element
  direction?: 'vertical' | 'horizental',
  bounceTop?: boolean,
  bounceBottom?: boolean,
  bounceLeft?: boolean,
  bounceRight?: boolean,
  bounceTime?: number,
  listenEvents?: Events
  momentum?: boolean
}


const Scroll = forwardRef((props: Scroll, ref) => {
  const [scrollInstance, setscrollInstance] = useState<BetterScroll>();

  const {
    probeType = PropTypeValues.probeType_3, // 控制监听事件类型
    click = true, // 是否派发点击事件
    className = '',
    children = '',
    direction = 'horizental',
    bounceTop = true,
    bounceBottom = true,
    bounceLeft = false,
    bounceRight = false,
    bounceTime = 800,
    momentum = true,
    listenEvents = {}
  } = props

  const BScrollRef = useRef(document.createElement('div'))

  useEffect(() => {
    if (BScrollRef && BScrollRef.current) {
      if (scrollInstance) return
      const instance = new BetterScroll(BScrollRef.current, {
        scrollX: direction === 'vertical',
        scrollY: direction === 'horizental',
        probeType: probeType,
        bounce: {
          top: bounceTop,
          bottom: bounceBottom,
          left: bounceLeft,
          right: bounceRight
        },
        bounceTime: bounceTime,
        click: click,
        observeDOM: true,
        momentum: momentum
      })
      setscrollInstance(instance)
    }
  }, [BScrollRef.current])



  useEffect(() => {
    //  事件处理
    if (!scrollInstance) {
      return
    }


    const bindEvent = (events: Events): void => {
      Object.keys(events).forEach((eventName) => {
        if (events[eventName]) {
          scrollInstance.on(eventName as any, (pos: {x:number, y: number} | undefined = undefined): any => {
            events[eventName](pos, scrollInstance.maxScrollY)
          })
        }
      })
    } 

    const destoryEvent = (events: Events): void => {
      Object.keys(events).forEach((eventName) => {
        if (events[eventName]) {
          scrollInstance.off(eventName  as any , events[(eventName)])
        }
      })
    }
    

    // 绑定时间
    bindEvent(listenEvents)
    return () => {
      if (!scrollInstance) {
        return
      }
      // 解绑事件
      destoryEvent(listenEvents)

    }
  }, [ scrollInstance ]);

  useEffect(() => {
    // 自动刷新高度
    if (scrollInstance) {
      // console.log(scrollInstance, 'scroll refresh')
      scrollInstance.refresh();
    }
  }, [children])

  useImperativeHandle(ref, () => ({
    refresh() {
      if (scrollInstance) {
        scrollInstance.refresh();
      }
    },
    scrollToElement: (el: HTMLElement | string, time?: number, offsetX?: number | boolean, offsetY?: number | boolean, easing?: object) => {
      if (scrollInstance) {
        scrollInstance.scrollToElement(el, time, offsetX, offsetY, easing)
      }
      
    },
    scrollTo(x: number, y: number) {
      if (scrollInstance) {
        scrollInstance.scrollTo(x, y);
      }
    }
  }));

  return (
    <div ref={BScrollRef} className={className}>
      { children }
    </div>
  )
})


export default memo(Scroll)
