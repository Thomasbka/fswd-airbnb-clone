import React from 'react';
import ReactDOM from 'react-dom';
import Login from '../src/login/login';

document.addEventListener('DOMContentLoaded', () => {
  const reactRoot = document.getElementById('react-root');
  if (reactRoot) {
    ReactDOM.render(<Login />, reactRoot);
  }
});
