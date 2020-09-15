import React, { memo, useEffect, useCallback } from 'react'
import HeaderBar from '../../components/common/HeaderBar'
import Scroll from '../../components/common/Scroll'
import style from './ranks.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRanksList } from './store/actions'
import { getIn } from 'immutable'
import { Rank } from './store/types'
import { useHistory } from 'react-router-dom'

/* 官方榜 */
const OfficialRanks = memo((props: {rankList: Rank[]}) => {
  const { rankList } = props
  return (
    <div className={ style['official-ranks-container'] }>
      <h3 className={ style['theme-title'] }>
        官方榜
      </h3>
      <ul className={ style['official-ranks-list'] }>
        {
          rankList.map((rank) => {
            return <OfficialRanksListItem rank={rank} key={ rank.id }/>
          })
        }
      </ul>
    </div>
  )
})


const OfficialRanksListItem = memo((props: {rank: Rank}) => {
  const { rank } = props
  const hisroty = useHistory()
  const link = useCallback(() => {
    hisroty.push('/albumdetail/' + rank.id)
  }, [])
  return (
    <li className={ style['official-ranks-list-item'] } onClick={ link }>
      <div className={ style['cover-container'] }>
        <div className={ style['update-frequency'] }>{ rank.updateFrequency }</div>
        <img src={ rank.coverImgUrl } className={ style['cover'] } alt=""/>
        <div className={ style['refresh-tag'] }></div>
      </div>
      <div className={ style['song-list'] }>
      
        {
          rank.tracks.map((item, index: number) => {
          return <div className={ style['song'] } key={ item.first }>{ index + 1}. { item.first } / { item.second }</div>
          })
        }
      </div>
    </li>
  )
})

/* 全球榜 */

const GlobalRanks = memo((props: {rankList: Rank[]}) => {
  const { rankList = [] } = props

  return (
    <div className={ style['global-ranks-container'] }>
      <h3 className={ style['theme-title'] }>
        全球榜
      </h3>
      <ul className={ style['global-ranks-list'] }>
        {
          rankList.map((rank) => {
            return <GlobalRanksListItem rank={rank} key={ rank.id }/>
          })
        }
      </ul>
    </div>
  )
})


const GlobalRanksListItem = memo((props: { rank: Rank }) => {
  const { rank } = props
  const hisroty = useHistory()
  const link = useCallback(() => {
    hisroty.push('/albumdetail/' + rank.id)
  }, [])
  return (
    <li className={ style['global-ranks-list-item'] } onClick={link}>
      <div className={ style['update-frequency'] }>{ rank.updateFrequency }</div>
      <img src={ rank.coverImgUrl } alt=""/>
    </li> 
  )
})

function Ranks () {
  const dispatch = useDispatch()
  const { officialList, globalList } = useSelector((state) => getIn(state, ['ranks']).toJS())

  useEffect(() => {
    dispatch(fetchRanksList())
  }, []);


  return (
    <div className={ style['ranks'] }>
      <HeaderBar title='排行榜' />
      <Scroll className={ style['scroll'] }>
        <div className={ style['scroll-wrap'] }>
          { officialList.length !== 0 ? <OfficialRanks rankList={ officialList } /> : null }
          { globalList.length !== 0 ? <GlobalRanks rankList={ globalList } /> : null }
        </div>
      </Scroll>
    </div>
  )
}

export default Ranks
