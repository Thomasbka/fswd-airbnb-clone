import React, { useState } from 'react';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';
import './editPropertyForm.scss';

const EditPropertyForm = ({ property, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    title: property.title || '',
    description: property.description || '',
    price_per_night: property.price_per_night || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ['title', 'description', 'price_per_night'];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        alert(`The field "${field}" is required.`);
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

    fetch(`/api/properties/${property.id}`, {
      method: 'PATCH',
      body: propertyPayload,
      headers: {
        ...safeCredentials().headers,
      },
    })
      .then(handleErrors)
      .then((data) => {
        alert('Property updated successfully!');
        if (onUpdate) onUpdate(data.property);
      })
      .catch((error) => {
        console.error('Error updating property:', error);
        alert('There was an error updating the property.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="edit-property-form">
      <h2>Edit Property</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
        </div>

        <div className="form-group">
          <label>Price per Night:</label>
          <input type="number" name="price_per_night" value={formData.price_per_night} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Image:</label>
          <input type="file" onChange={handleImageChange} />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
        </button>
        {onCancel && (
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default EditPropertyForm;
