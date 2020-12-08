import React, { Component } from 'react';
import { Redirect } from 'react-router';
import NavBar from '../LandingPage/Navbar.js';
import Geocode from 'react-geocode';
import { graphql } from 'react-apollo';
import { restaurantSignupMutation } from '../../mutation/mutations';

Geocode.setApiKey('AIzaSyAIzrgRfxiIcZhQe3Qf5rIIRx6exhZPwwE');
Geocode.setLanguage('en');
Geocode.setRegion('us');

class RestaurantCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = async (e) => {
    console.log('Submitting restaurant info');
    //prevent page from refresh
    e.preventDefault();

    if (this.state.password !== this.state.passwordRe) {
      alert('Passwords do not match!!!');
      return;
    }

    Geocode.fromAddress(this.state.zipcode).then(
      async (resp) => {
        console.log('Locations');
        console.log(resp.results[0].geometry);

        let mutationResponse = await this.props.restaurantSignupMutation({
          variables: {
            restaurant_name: this.state.restName,
            email_id: this.state.email_id,
            password: this.state.password,
            zip_code: this.state.zipcode,
            lat: resp.results[0].geometry.location.lat,
            lng: resp.results[0].geometry.location.lng,
          },
        });
        let response = mutationResponse.data.restaurantSignup;

        if (response) {
          this.setState({
            message: response.message,
            signupDone: 1,
          });
        }
      },
      (error) => {
        console.error(error);
        alert('Please enter a valid zip code');
      }
    );
  };
  render() {
    let redirectVar = null;
    let message = '';
    console.log('Restaurant Signup render');
    if (localStorage.getItem('restaurant_id')) {
      redirectVar = <Redirect to='/home' />;
    } else if (
      this.state.message === 'RESTAURANT_ADDED' &&
      this.state.signupDone
    ) {
      alert('Registration successful!');
      redirectVar = <Redirect to='/login' />;
    } else if (
      this.state.message === 'RESTAURANT_EXISTS' &&
      this.state.signupDone
    ) {
      message = 'This Restaurant is already on Yelp!';
    } else if (
      this.state.message === 'INTERNAL_SERVER_ERROR' &&
      this.state.signupDone
    ) {
      message = 'Server error!';
    }
    return (
      <div>
        {redirectVar}
        <NavBar />
        <div>
          <br />
          <div className='container'>
            <h2 id='signup'>Sign up for Yelp</h2>
            <br />
            <form onSubmit={this.onSubmit}>
              <div style={{ width: '30%' }} class='form-group'>
                <input
                  type='text'
                  class='form-control'
                  name='restName'
                  onChange={this.onChange}
                  id='restName'
                  placeholder='Restaurant Name'
                  required
                />
              </div>
              <br />
              <div style={{ width: '30%' }} class='form-group'>
                <input
                  type='text'
                  class='form-control'
                  name='zipcode'
                  onChange={this.onChange}
                  id='zipcode'
                  placeholder='Location (Enter Zip Code)'
                  required
                />
              </div>
              <br />
              <div style={{ width: '30%' }} class='form-group'>
                <input
                  type='text'
                  class='form-control'
                  name='email_id'
                  onChange={this.onChange}
                  id='email_id'
                  placeholder='Email Id'
                  required
                />
              </div>
              <br />
              <div style={{ width: '30%' }} class='form-group'>
                <input
                  type='password'
                  class='form-control'
                  name='password'
                  onChange={this.onChange}
                  id='password'
                  placeholder='Password'
                  required
                />
              </div>
              <br />
              <div style={{ width: '30%' }} class='form-group'>
                <input
                  type='password'
                  class='form-control'
                  name='passwordRe'
                  onChange={this.onChange}
                  id='passwordRe'
                  placeholder='Re Enter Password'
                  required
                />
              </div>
              <br />
              <div style={{ color: '#ff0000' }}>{message}</div>
              <br />
              <div style={{ width: '30%' }}>
                <button class='btn btn-success' type='submit'>
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default graphql(restaurantSignupMutation, {
  name: 'restaurantSignupMutation',
})(RestaurantCreate);
