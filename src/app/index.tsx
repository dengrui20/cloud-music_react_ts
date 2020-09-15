import React from 'react';
import './app.scss';
import renderRoutes from '../router/renderRouters'
import routes from '../router/config'
import { HashRouter as Router } from 'react-router-dom'


function App() {
  return (
    <div className="App">
      <Router>
        {renderRoutes(routes)}
      </Router>
    </div>
  );
}

export default App;
