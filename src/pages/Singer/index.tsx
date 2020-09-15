import React, { useEffect, memo, useCallback, useRef } from 'react'
import HeaderBar from '../../components/common/HeaderBar'
import { fetchSingerList, setSingerArea, setSingerType, setSingerList, setFetching } from './store/actions'
import { useDispatch, useSelector } from 'react-redux'
import classnames from 'classnames'
import style from './singer.module.scss'
import Scroll from '../../components/common/Scroll'
import LazyLoad, { forceCheck } from 'react-lazyload'
import { useHistory } from 'react-router-dom'
import { getIn } from 'immutable'
import { SingerType } from '../../store/types'
import { Singer } from './store/types'
import BScroll from 'better-scroll'

const FilterContainer = memo(() => {
  const { type, area } = useSelector((state) => getIn(state, ['staticData', 'filterSingerData'], '').toJS())
  const dispatch = useDispatch()
  const clickFiler = useCallback((filterId, fitertType) => {
    if (fitertType === 'area') {
      dispatch(setSingerArea(filterId))

    }

    if (fitertType === 'type') {
      dispatch(setSingerType(filterId))
    }

    dispatch(setSingerList())
    dispatch(setFetching(false))
    dispatch(fetchSingerList())
  },[])
  return (
    <div className={ style['filter-container'] }>
      <ul className={ classnames(style['type'], style['filter-list']) }>
        {
          type.map((item: SingerType) => {
            return <FilterListItem key={ item.id } filterItem={ item } clickHalder={ clickFiler } filterType="type" />
          })
        }
      </ul>
      <ul className={ classnames(style['area'], style['filter-list']) }>
        {
          area.map((item: SingerType) => {
            return <FilterListItem key={ item.id } filterItem={ item } clickHalder={ clickFiler } filterType='area' />
          })
        }
      </ul>
    </div>
  )
})

interface FilterListItem {
  filterItem: SingerType
  filterType: string,
  clickHalder: (filterId:number, fitertType: string) => void
}

const FilterListItem: React.FC<FilterListItem> = memo((props) => {
  const { filterItem, filterType, clickHalder } = props
  const { singerType, singerArea } = useSelector((state) => getIn(state, ['singer'], '').toJS())
  const actId = filterType === 'type' ? singerType : singerArea

  return (
    <li className={ classnames({ [style['act']]: actId === filterItem.id }) } onClick={ () => clickHalder(filterItem.id, filterType) }>
      { filterItem.text }
    </li>
  )
})


const SingerListItem: React.FC<{ singerInfo: Singer }> = memo((props) => {
  const { singerInfo } = props
  const history = useHistory()
  const querySingerDetail = useCallback(() => {
    history.push('/singerdetail/' + singerInfo.id)
  }, [])

  return (
    <li className={ style['singer-list-item'] } onClick={ querySingerDetail }>
      <div className={ style['singer-info'] }>
        <LazyLoad placeholder={ <img className={ style['singer-pic'] } src={ require('./singer.png') } alt=""/> } >
          <img className={ style['singer-pic'] } src={ singerInfo.img1v1Url + '?param=50x50' } alt=""/>
        </LazyLoad>
        <div className={ style['singer-name'] }>
          { singerInfo.name }
          <span className={ style['singer-alias'] } >{ singerInfo.aliasName }</span>
        </div>
      </div>
      <div className={ style['follow'] }>
        关注
      </div>
    </li>
  )
})

const Singers = () => {
  const dispatch = useDispatch()
  const { data } = useSelector((state) => getIn(state, ['singer', 'singerList']).toJS())
  const scroll = useRef<BScroll>()
  useEffect(() => {
    dispatch(fetchSingerList())
  }, [])

  useEffect(() => {
    scroll.current && scroll.current.refresh()
  }, [ data ])

  const scrollEvent = useCallback(({ y }, maxY) => {
    forceCheck()
    if (maxY > y - 100) {
      dispatch(fetchSingerList())
    }
  }, [])

  return (
    <div className={ style['singer'] }>
      <HeaderBar title="歌手分类" className={ style['header-bar'] } />
      <FilterContainer />
      <Scroll className={ style['scroll'] } ref={ scroll } listenEvents={{ scroll: scrollEvent }}>
        <div>
          <h3 className={ style['singer-title'] }>热门歌手</h3>
          <ul className={ style['singer-list'] }>
            {
              data.map((singer: Singer) => {
                return <SingerListItem singerInfo={ singer } key={ singer.id } />
              })
            }
          </ul>
        </div>
      </Scroll>
    </div>
  )
}

export default memo(Singers)
