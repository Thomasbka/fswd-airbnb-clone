import React, { useState } from 'react';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';
import './editPropertyForm.scss';

const EditPropertyForm = ({ property, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    title: property.title || '',
    description: property.description || '',
    price_per_night: property.price_per_night || '',
    image_url: property.image_url || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`/api/properties/${property.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ property: formData }),
      ...safeCredentials(),
    })
      .then(handleErrors)
      .then(data => {
        alert('Property updated successfully!');
        if (onUpdate) onUpdate(data.property);
      })
      .catch(error => {
        console.error('Error updating property:', error);
        alert('There was an error updating the property.');
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
          <label>Image URL:</label>
          <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} />
        </div>

        <button type="submit">Save Changes</button>
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
