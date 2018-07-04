import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import setAuthToken from './utils/setAuthToken'
import { setCurrentUser } from './actions/authActions'

import { Provider } from 'react-redux'
import './App.css';
import store from './store'

import Navbar from './components/layouts/Navbar'
import Footer from './components/layouts/Footer'
import Landing from './components/layouts/Landing'

import Register from './components/auth/Register'
import Login from './components/auth/Login'

//check for token

if(localStorage.jwtToken) {
  //set auth token header auth
  setAuthToken(localStorage.jwtToken)
  //decode the token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

}

class App extends Component {
  render() {
    return (
      <Provider store={store} >
        <Router>
        <div className="App">
        <Navbar />
        <Route path='/' exact component={Landing} />
          <div className='container'>
          <Route path='/register' exact  component={Register} />
          <Route path='/login' exact  component={Login} />

          </div>
        <Footer />
        </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
