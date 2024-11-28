import React, { useState } from 'react';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';
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
    setFormData((prevData) => ({
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
    Object.keys(formData).forEach((key) => {
      propertyPayload.append(`property[${key}]`, formData[key]);
    });

    if (imageFile) {
      propertyPayload.append('property[image]', imageFile);
    }

    setIsSubmitting(true);
    

    fetch(`/api/properties/${property.id}`, {
      method: 'PATCH',
      body: propertyPayload,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
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
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="price_per_night">Price per Night:</label>
          <input
            id="price_per_night"
            type="number"
            name="price_per_night"
            value={formData.price_per_night}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image:</label>
          <input id="image" type="file" onChange={handleImageChange} />
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
