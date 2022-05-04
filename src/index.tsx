import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './components/App/App';

ReactDOM.render(
  <Router basename="/github-users-mui">
    <App />
  </Router>,
  document.getElementById('root')
);
