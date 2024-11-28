import React, { useState } from 'react';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';
import './createProperty.scss';
import Layout from '../layout';

const CreateProperty = ({ onCreateSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    country: '',
    property_type: '',
    price_per_night: '',
    max_guests: '',
    bedrooms: '',
    beds: '',
    baths: '',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiredLabel = (label) => (
    <span>
      {label}
      <span style={{ color: 'red' }}> *</span>
    </span>
  );

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setImageFile(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ['title', 'description', 'city', 'country', 'property_type', 'price_per_night', 'max_guests'];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        alert(`The field "${field}" is required.`);
        return;
      }
    }

    const numberFields = ['price_per_night', 'max_guests', 'bedrooms', 'beds', 'baths'];
    for (const field of numberFields) {
      if (formData[field] && (isNaN(parseInt(formData[field], 10)) || parseInt(formData[field], 10) <= 0)) {
        alert(`The field "${field}" must be a valid positive number.`);
        return;
      }
    }

    const propertyPayload = new FormData();
    for (const key in formData) {
      propertyPayload.append(`property[${key}]`, formData[key]);
    }

    if (imageFile) {
      propertyPayload.append('property[image]', imageFile);
    }

    setIsSubmitting(true);

    fetch('/api/properties', {
      method: 'POST',
      body: propertyPayload,
      headers: {
        ...safeCredentials().headers,
      },
    })
      .then(handleErrors)
      .then((data) => {
        alert('Property created successfully!');
        if (onCreateSuccess) onCreateSuccess(data.property);
      })
      .catch((error) => {
        console.error('Error creating property:', error);
        alert('There was an error creating the property.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Layout>
      <div className="create-property-form">
        <h2>Create Property</h2>
        <form className="container" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{requiredLabel('Title:')}</label>
            <input type="text" name="title" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>{requiredLabel('Description:')}</label>
            <textarea name="description" onChange={handleChange} required></textarea>
          </div>

          <div className="form-group">
            <label>{requiredLabel('City:')}</label>
            <input type="text" name="city" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>{requiredLabel('Country:')}</label>
            <input type="text" name="country" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>{requiredLabel('Property Type:')}</label>
            <input type="text" name="property_type" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>{requiredLabel('Price per Night:')}</label>
            <input type="number" name="price_per_night" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>{requiredLabel('Max Guests:')}</label>
            <input type="number" name="max_guests" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Bedrooms:</label>
            <input type="number" name="bedrooms" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Beds:</label>
            <input type="number" name="beds" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Baths:</label>
            <input type="number" name="baths" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>{requiredLabel('Image:')}</label>
            <input type="file" name="image" onChange={handleChange} />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Property...' : 'Create Property'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateProperty;
