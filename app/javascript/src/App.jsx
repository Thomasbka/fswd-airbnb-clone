import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './home';
import CreateProperty from './property/createProperty';
import PropertyDetails from './property/property';
import BookingsIndex from './property/bookingsIndex';
import Success from './property/success';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/properties/new" element={<CreateProperty />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
      <Route path="/bookings" element={<BookingsIndex />} />
      <Route path="/booking/:id/success" element={<Success />} />
    </Routes>
  );
};

export default App;
