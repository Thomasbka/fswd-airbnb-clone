import React, { useState, useEffect } from 'react';
import Layout from '@src/layout';
import { handleErrors } from '@utils/fetchHelper';
import './bookingsIndex.scss';

const BookingsIndex = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bookings')
      .then(handleErrors)
      .then(data => {
        setBookings(data.bookings);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container">
          <p>Loading bookings...</p>
        </div>
      </Layout>
    );
  }

  if (bookings.length === 0) {
    return (
      <Layout>
        <div className="container">
          <p>You have no bookings.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <h1 className="mt-4">Your Bookings</h1>
        <div className="mt-4 bookings-grid">
          {bookings.map(booking => {
            const { id, property, start_date, end_date, is_paid } = booking;
            return (
              <div
                className="booking-card"
                key={id}
                onClick={() => window.location.href = `/property/${property.id}`}
              >
                <img
                  src={property.image_url}
                  alt={property.title}
                  className="booking-image"
                />
                <div className="booking-info">
                  <h3>{property.title}</h3>
                  <p><b>Dates:</b> {new Date(start_date).toLocaleDateString()} - {new Date(end_date).toLocaleDateString()}</p>
                  <p><b>Location:</b> {property.city}, {property.country}</p>
                  <p><b>Paid:</b> {is_paid ? 'Yes' : 'No'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default BookingsIndex;
