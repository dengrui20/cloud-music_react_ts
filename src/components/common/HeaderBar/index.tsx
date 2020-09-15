import React, { memo, useCallback } from 'react'
import style from './headerBar.module.scss'
import classnames from 'classnames'
import { useHistory } from 'react-router-dom'

export interface HeaderBar {
  leftElement?: JSX.Element
  rightElement?: JSX.Element | null
  title?: string,
  className?: string,
  styles?: {
    [key: string]: string
  }
  hasBorder?: boolean
}

const HeaderBar: React.FC<HeaderBar> = (props) => {
  const { leftElement = '', rightElement = '', title = '', className = '', styles = {}, hasBorder = true } = props
  const history = useHistory()
  const goBack = useCallback(() => {
    history.goBack()
  }, []) 

  return (
    <div className={ classnames(style['header-bar'], className) } style={ styles }>
      <div className={ style['left'] } onClick={ goBack }>
        <i className={ classnames('iconfont', style['icon-back']) }>&#xe602;</i>
        { leftElement }
      </div>
      <div className={ style['title'] }>
        { title }
      </div>
      <div className={ style['right'] }>
        { rightElement }
      </div>
    { hasBorder ? <div className={ style['half-border'] }></div> : null }
    </div>
  )
}

export default memo(HeaderBar)
