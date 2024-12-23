import React from 'react';
import ReactDOM from 'react-dom';
import Home from '@src/home';

document.addEventListener('DOMContentLoaded', () => {
  const reactRoot = document.getElementById('react-root');
  if (reactRoot) {
    ReactDOM.render(<Home />, reactRoot);
  }
});
