import React from 'react';
import ReactDOM from 'react-dom';
import CreateProperty from '../src/property/createProperty';

document.addEventListener('DOMContentLoaded', () => {
  const reactRoot = document.getElementById('react-root');
  if (reactRoot) {
    ReactDOM.render(<CreateProperty />, reactRoot);
  }
});
