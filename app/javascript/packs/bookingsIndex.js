import React from 'react';
import ReactDOM from 'react-dom';
import BookingsIndex from '../src/property/bookingsIndex';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <BookingsIndex />,
    document.body.appendChild(document.createElement('div')),
  )
});
