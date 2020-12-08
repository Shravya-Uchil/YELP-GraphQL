import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Login from './Login/Login';
import Navbar from './LandingPage/Navbar';
import Signup from './Signup/Signup';
import BizSignup from './Signup/BizSignup';
import Home from './Home/Home';
import CustomerHome from './Home/CustomerHome';
import CustomerProfile from './Profile/UserProfile';
import Profile from './Profile/Profile';
import RestaurantProfile from './Profile/RestaurantProfile';
import Restaurant from './Restaurant/Restaurant';
import RestaurantHome from './Home/RestaurantHome';
import AddItem from './Restaurant/AddItem';
import CustomerOrderHistory from './Order/CustomerOrderHistory';
import RestaurantOrders from './Order/RestaurantOrders';
import CustomerCard from './Customer/CustomerCard';
import RestaurantReview from './Restaurant/RestaurantReview';
//Create a Main Component
class Main extends Component {
  render() {
    return (
      <div>
        {/*Render Different Component based on Route*/}
        <Route exact path='/' component={Navbar} />
        <Route path='/login' component={Login} />
        <Route path='/signup' component={Signup} />
        <Route path='/bizsignup' component={BizSignup} />
        <Route path='/home' component={Home} />
        <Route path='/customerhome' component={CustomerHome} />
        <Route path='/profile' component={Profile} />
        <Route path='/customerprofile' component={CustomerProfile} />
        <Route path='/restaurantprofile' component={RestaurantProfile} />
        <Route path='/restaurant' component={Restaurant} />
        <Route path='/restauranthome' component={RestaurantHome} />
        <Route path='/additem' component={AddItem} />
        <Route path='/customerorderhistory' component={CustomerOrderHistory} />
        <Route path='/restaurantorders' component={RestaurantOrders} />
        <Route path='/customercard' component={CustomerCard} />
        <Route path='/restaurantreview' component={RestaurantReview} />
      </div>
    );
  }
}
//Export The Main Component
export default Main;
