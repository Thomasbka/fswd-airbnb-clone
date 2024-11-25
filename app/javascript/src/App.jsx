import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './home';
import CreateProperty from './property/createProperty';
import PropertyDetails from './property/property';
import BookingsIndex from './property/bookingsIndex';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/properties/new" element={<CreateProperty />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
      <Route path="/bookings" element={<BookingsIndex />} />
    </Routes>
  );
};

export default App;
