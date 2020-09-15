import React from 'react';
import { Switch, Route  } from 'react-router-dom';
import { Routes } from './config'
const renderRoutes = (routes: Routes, extraProps?: any, switchProps?: any) =>
  routes ? (
    
    <Switch { ...switchProps }>
      { routes.map((route, i) => {
          return (
            <Route
              key={ route.key || i }
              path={ route.path }
              exact={ route.exact }
              strict={ route.strict }
              children={ route.children }
              render={ props => {
                
                return <route.component { ...props } { ...extraProps } route={ route }/>
               } }
            />)
         }
      )
     }
    </Switch>
  ) : null;
export default renderRoutes;