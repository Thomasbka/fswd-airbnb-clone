import React, { useState, useEffect } from 'react';
import { handleErrors } from '@utils/fetchHelper';
import './bookingsIndex.scss';
import Layout from '../layout';

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
    return <p>Loading...</p>;
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
        <h2>Your Bookings</h2>
        <div className="row">
          {bookings.map(booking => (
            <div key={booking.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{booking.property.title}</h5>
                  <p className="card-text">
                    {booking.property.city}, {booking.property.country}
                  </p>
                  <p className="card-text">
                    From: {new Date(booking.start_date).toLocaleDateString()} <br />
                    To: {new Date(booking.end_date).toLocaleDateString()}
                  </p>
                  <p className={`text-${booking.is_paid ? 'success' : 'danger'}`}>
                    {booking.is_paid ? 'Paid' : 'Not Paid'}
                  </p>
                  {!booking.is_paid && (
                    <button
                      className="btn btn-primary"
                      onClick={() => initiateStripeCheckout(booking.id)}
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

const initiateStripeCheckout = (bookingId) => {
  fetch(`/api/charges?booking_id=${bookingId}&cancel_url=/bookings`, {
    method: 'POST',
    credentials: 'include',
  })
    .then(handleErrors)
    .then(response => {
      const stripe = Stripe(`${process.env.STRIPE_PUBLISHABLE_KEY}`);
      stripe.redirectToCheckout({ sessionId: response.charge.checkout_session_id });
    })
    .catch(error => {
      console.error('Error initiating Stripe checkout:', error);
    });
};

export default BookingsIndex;
