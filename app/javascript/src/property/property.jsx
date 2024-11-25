import React from 'react';
import Layout from '@src/layout';
import BookingWidget from './bookingWidget';
import EditPropertyForm from './editPropertyForm';
import { handleErrors } from '@utils/fetchHelper';

import './property.scss';

class Property extends React.Component {
  state = {
    property: {},
    loading: true,
    editing: false,
    currentUser: null,
  };

  componentDidMount() {
    fetch(`/api/properties/${this.props.property_id}`)
      .then(handleErrors)
      .then(data => {
        console.log('Fetched property:', data.property);
        this.setState({
          property: data.property,
          loading: false,
        });
      });

    fetch('/api/current_user', {
      method: 'GET',
      credentials: 'include',
    })
      .then(handleErrors)
      .then(data => {
        this.setState({ currentUser: data.user });
      })
      .catch(error => {
        console.error('Error fetching current user:', error);
      });
  }

  toggleEditing = () => {
    this.setState(prevState => ({ editing: !prevState.editing }));
  };

  handleUpdate = (updatedProperty) => {
    const { property } = this.state;
    console.log('Updated Property:', updatedProperty);

    this.setState({
      property: { ...updatedProperty, ...updatedProperty },
      editing: false,
    });
  };

  render() {
    const { property, loading, editing, currentUser } = this.state;

    if (loading) {
      return <p>Loading...</p>;
    }

    const {
      id,
      title,
      description,
      city,
      country,
      property_type,
      price_per_night,
      max_guests,
      bedrooms,
      beds,
      baths,
      image_url,
      user,
    } = property;

    const isOwner = currentUser && user && currentUser.id === user.id;

    return (
      <Layout>
        <div className="property-image mb-3" style={{ backgroundImage: `url(${image_url})` }} />
        <div className="container">
          <div className="row">
            <div className="info col-12 col-lg-7">
              <div className="mb-3">
                <h3 className="mb-0">{title}</h3>
                <p className="text-uppercase mb-0 text-secondary"><small>{city}</small></p>
                <p className="mb-0"><small>Hosted by <b>{user?.username || 'Unknown'}</b></small></p>
              </div>
              <div>
                <p className="mb-0 text-capitalize"><b>{property_type}</b></p>
                <p>
                  <span className="me-3">{max_guests} guests</span>
                  <span className="me-3">{bedrooms} bedroom</span>
                  <span className="me-3">{beds} bed</span>
                  <span className="me-3">{baths} bath</span>
                </p>
              </div>
              <hr />
              <p>{description}</p>
            </div>
            <div className="col-12 col-lg-5">
              <BookingWidget property_id={id} price_per_night={price_per_night} />
            </div>
            {isOwner && (
              <>
                <button onClick={this.toggleEditing}>
                  {editing ? 'Cancel edit' : 'Edit Property'}
                </button>
                {editing && (
                  <EditPropertyForm
                    property={property}
                    onUpdate={this.handleUpdate}
                    onCancel={this.toggleEditing}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </Layout>
    );
  }
}

export default Property;

