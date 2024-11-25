import React from 'react';
import ReactDOM from 'react-dom';
import Property from '../src/property/property';

document.addEventListener('DOMContentLoaded', () => {
  const reactRoot = document.getElementById('react-root');
  const paramsDiv = document.getElementById('params');

  if (reactRoot && paramsDiv) {
    const params = JSON.parse(paramsDiv.dataset.params);
    ReactDOM.render(
      <Property property_id={params.property_id} />,
      reactRoot
    );
  } else {
    console.error('React root or params div not found!');
  }
});
