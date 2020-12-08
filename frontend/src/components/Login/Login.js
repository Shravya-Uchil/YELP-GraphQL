import React, { Component } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import NavBar from '../LandingPage/Navbar.js';
import jwt_decode from 'jwt-decode';
import { graphql } from 'react-apollo';
import { loginMutation } from '../../mutation/mutations';

//Define a Login Component
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 1,
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  //submit Login handler to send a request to the node backend
  submitLogin = async (e) => {
    e.preventDefault();
    let login_type = document.getElementById('login_type').value;
    let mutationResponse = await this.props.loginMutation({
      variables: {
        email_id: this.state.email_id,
        password: this.state.password,
        login_type: login_type,
      },
    });
    let response = mutationResponse.data.login;
    if (response) {
      if (response.status === '200') {
        var decoded = jwt_decode(response.message.split(' ')[1]);
        localStorage.setItem('token', response.message);
        if (decoded.login_type === 0) {
          localStorage.setItem('email_id', decoded.email_id);
          localStorage.setItem('customer_id', decoded.id);
          localStorage.setItem('login_type', 'customer');
          localStorage.setItem('from', decoded.cust_name);
        } else {
          localStorage.setItem('email_id', decoded.email_id);
          localStorage.setItem('restaurant_id', decoded.id);
          localStorage.setItem('login_type', 'restaurant');
          localStorage.setItem('from', decoded.restaurant_name);
        }

        this.setState({
          loginDoneOnce: 1,
          status: 200,
          message: response.message,
        });
      } else {
        this.setState({
          loginDoneOnce: 1,
          message: response.message,
          status: response.status,
        });
      }
    }
  };

  render() {
    console.log('Login render');
    let message = '';
    let redirectVar = null;
    if (this.state.message === 'NO_RECORD' && this.state.loginDoneOnce) {
      message = 'Cannot recognize username or password!!!';
    } else if (
      this.state.message === 'INCORRECT_PASSWORD' &&
      this.state.loginDoneOnce
    ) {
      message = 'Incorrect Password!!!';
    } else if (this.state.status === 200) {
      redirectVar = <Redirect to='/home' />;
    }
    return (
      <div>
        {redirectVar}
        <NavBar />
        <div class='container'>
          <div class='login-form'>
            <div class='main-div'>
              <div class='panel'>
                <h2>Login</h2>
                <p>Please enter your username and password</p>
              </div>
              <form onSubmit={this.submitLogin}>
                <div style={{ color: '#ff0000' }}>{message}</div>
                <br />
                <div class='form-group'>
                  Choose login type:
                  <select id='login_type' name='type'>
                    <option value='customer'>Customer</option>
                    <option value='restaurant'>Restaurant</option>
                  </select>
                </div>
                <div class='form-group'>
                  <input
                    type='text'
                    class='form-control'
                    name='email_id'
                    onChange={this.onChange}
                    placeholder='Email Id'
                  />
                </div>
                <div class='form-group'>
                  <input
                    type='password'
                    class='form-control'
                    name='password'
                    onChange={this.onChange}
                    placeholder='Password'
                  />
                </div>
                <button type='submit' class='btn btn-primary'>
                  Login
                </button>
                <div class='login-link'>
                  <Link to='/signup'> Customer Sign up </Link>
                </div>
                <div class='login-link'>
                  <Link to='/bizsignup'> Restaurant Sign up </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//export Login Component
export default graphql(loginMutation, { name: 'loginMutation' })(Login);
