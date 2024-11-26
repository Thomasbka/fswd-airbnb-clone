import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@src/layout';
import { handleErrors } from '@utils/fetchHelper';
import './success.scss';

const Success = () => {
  const params = useParams();
  const booking_id = params.id;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!booking_id) return;
    fetch(`/api/bookings/${booking_id}`)
      .then(handleErrors)
      .then(data => {
        setBooking(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching booking:', error);
        setLoading(false);
      });
  }, [booking_id]);

  if (loading) {
    return (
      <Layout>
        <div className="container text-center mt-5">
          <p>Loading booking information...</p>
        </div>
      </Layout>
    );
  }

  if (!booking) {
    return (
      <Layout>
        <div className="container text-center mt-5">
          <p>Booking not found.</p>
        </div>
      </Layout>
    );
  }

  const { property, start_date, end_date, is_paid } = booking;

  return (
    <Layout>
      <div className="container mt-5">
        <div className="card mx-auto" style={{ maxWidth: '800px' }}>
          <div className="card-body text-center">
            <h3 className="mt-3">
              Thank you for booking {property.title}
            </h3>
            <p>
              Your booking is being processed. You will receive a confirmation via email
              once it is complete.
            </p>
          </div>
          <div className="card mt-1 mx-3 mb-3">
            <img
              src={property.image_url}
              alt={property.title}
              className="card-img-top"
              style={{ borderRadius: '10px' }}
            />
            <div className="card-body">
              <h4 className="card-title">Booking Details:</h4>
              <p>
                <b>Property:</b> {property.title}
              </p>
              <p>
                <b>Dates:</b>{' '}
                {new Date(start_date).toLocaleDateString()} to{' '}
                {new Date(end_date).toLocaleDateString()}
              </p>
              <p>
                <b>Status:</b> {is_paid ? 'Paid' : 'Processing Payment'}
              </p>
            </div>
          </div>
          <button
            className="btn btn-primary mt-3 mb-3 mx-auto d-block"
            onClick={() => (window.location.href = '/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Success;
