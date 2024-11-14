import React from 'react';
import './layout.scss';

const Layout = (props) => {
  const { currentUser } = props;

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
                <li className="nav-item">
                  <a className="nav-link" href="/properties/new">Create Property</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      {props.children}
      <footer className="p-3 bg-light text-center">
        <div>
          <p className="mb-0 text-secondary">Airbnb Clone</p>
        </div>
      </footer>
    </React.Fragment>
  );
}

export default Layout;