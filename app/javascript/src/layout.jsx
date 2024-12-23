import React, { useState, useEffect } from 'react';
import '../src/layout.scss';

const Layout = (props) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch('/api/current_user', {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch current user');
      }
    })
    .then(data => {
      if (data.user) {
        setCurrentUser(data.user);
      }
    })
    .catch(error => {
      console.error('Error fetching current user:', error);
      setCurrentUser(null);
    });
  }, []);

  const handleLogout = () => {
    fetch('/api/sessions', {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(response => {
        if (response.ok) {
          setCurrentUser(null);
          window.location.href = '/';
        } else {
          throw new Error('Logout failed');
        }
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <React.Fragment>
      <nav className="navbar navbar-expand navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand text-danger" href="/">Airbnb</a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">Home</a>
              </li>
              {currentUser && (
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="/properties/new">Create Property</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/bookings">My Bookings</a>
                  </li>
                </>
              )}
            </ul>
            <ul className="navbar-nav ms-auto">
              {currentUser ? (
                <li className="nav-item">
                  <button className="btn btn-outline-danger" onClick={handleLogout}>
                    Log Out
                  </button>
                </li>
              ) : (
                <li className="nav-item">
                  <a className="nav-link" href="/login">Log In</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <main className="wrapper">{props.children}</main>
      <footer className="p-3 bg-light text-center">
        <div>
          <p className="mb-0 text-secondary">Airbnb Clone</p>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default Layout;