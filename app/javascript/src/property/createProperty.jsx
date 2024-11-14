import React, { useState } from 'react';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';
import './createProperty.scss';

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
    image_url: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setImageFile(e.target.files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = () => {
    if (!imageFile) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', imageFile);

    fetch('/api/properties/upload_image', {
      method: 'POST',
      body: uploadData,
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
      alert('Please upload the image first.');
      return;
    }

    const propertyPayload = {
      ...formData,
      image_url: formData.image_url,
    };

    fetch('/api/properties', {
      method: 'POST',
      body: JSON.stringify({ property: propertyPayload }),
      headers: {
        'Content-Type': 'application/json',
        ...safeCredentials().headers,
      },
    })
      .then(handleErrors)
      .then(data => {
        alert('Property created successfully!');
        if (onCreateSuccess) onCreateSuccess(data.property);
      })
      .catch(error => {
        console.error('Error creating property:', error);
        alert('There was an error creating the property.');
      });
  };

  return (
    <div className="create-property-form">
      <h2>Create Property</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" name="title" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" onChange={handleChange} required></textarea>
        </div>

        <div className="form-group">
          <label>City:</label>
          <input type="text" name="city" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Country:</label>
          <input type="text" name="country" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Property Type:</label>
          <input type="text" name="property_type" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Price per Night:</label>
          <input type="number" name="price_per_night" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Image:</label>
          <input type="file" name="image" onChange={handleChange} />
          <button type="button" onClick={handleImageUpload} disabled={!imageFile || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>

        <button type="submit" disabled={isUploading}>Create Property</button>
      </form>
    </div>
  );
};

export default CreateProperty;
