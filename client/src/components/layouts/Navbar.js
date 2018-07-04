import React, { Component } from "react";
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logoutUser, loginUser } from '../../actions/authActions'

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to='/'>
            DevConnector
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to='/profiles'>
                  {" "}
                  Developers
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to='/register' className="nav-link" >
                  Sign Up
                </Link>
              </li>
              <li className="nav-item">
                <Link to='/login' className="nav-link" >
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps, {loginUser})(Navbar);



// OSTANOVILSA NA 044 //  0:05:50