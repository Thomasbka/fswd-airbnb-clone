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
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleImageUpload = () => {
    if (!imageFile) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    fetch('/api/properties/upload_image', {
      method: 'POST',
      body: formData,
      ...safeCredentials(),
    })
      .then(handleErrors)
      .then(data => {
        setFormData(prevData => ({
          ...prevData,
          image_url: data.image_url,
        }));
        setIsUploading(false);
        alert('Image uploaded successfully!');
      })
      .catch(error => {
        console.error('Error uploading image:', error);
        setIsUploading(false);
        alert('There was an error uploading the image.');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (imageFile && !formData.image_url) {
      alert("Please upload the image first.");
      return;
    }

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
          <label>Image:</label>
          <input type="file" onChange={handleImageChange} />
          <button type="button" onClick={handleImageUpload} disabled={!imageFile || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>

        <button type="submit" disabled={isUploading}>Save Changes</button>
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
