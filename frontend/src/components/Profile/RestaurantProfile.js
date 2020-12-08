import React, { Component } from 'react';
import axios from 'axios';
import {
  Container,
  Col,
  Row,
  Form,
  Button,
  ButtonGroup,
  Card,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getRestaurantProfileQuery } from '../../queries/queries';
import { updateRestaurantProfileMutation } from '../../mutation/mutations';
import { withApollo, graphql } from 'react-apollo';
import * as compose from 'lodash.flowright';

class RestaurantProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  componentDidMount() {
    this.props.client
      .query({
        query: getRestaurantProfileQuery,
        variables: {
          restaurant_id: localStorage.getItem('restaurant_id'),
        },
      })
      .then((response) => {
        var restaurant = response.data.restaurant;
        console.log('got the restaurant ' + JSON.stringify(restaurant));
        if (restaurant.status === '200') {
          var restaurantData = {
            restaurant_id: restaurant.id,
            restaurant_name:
              restaurant.restaurant_name || this.state.restaurant_name,
            email_id: restaurant.email_id || this.state.email_id,
            phone_number: restaurant.phone_number || this.state.phone_number,
            description: restaurant.description || this.state.description,
            zip_code: restaurant.zip_code || this.state.zip_code,
            curbside_pickup:
              restaurant.curbside_pickup || this.state.curbside_pickup,
            dine_in: restaurant.dine_in || this.state.dine_in,
            yelp_delivery: restaurant.yelp_delivery || this.state.yelp_delivery,
            cuisine: restaurant.cuisine || this.state.cuisine,
            restaurant_image:
              restaurant.restaurant_image || this.state.restaurant_image,
          };
          this.setState(restaurantData);
        }
      });
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onRefresh = (e) => {
    if (this.state.curbside_pickup) {
      document.getElementById('curbside_pickup').checked = true;
    }
    if (this.state.dine_in) {
      document.getElementById('dine_in').checked = true;
    }
    if (this.state.yelp_delivery) {
      document.getElementById('yelp_delivery').checked = true;
    }
  };

  onUpdate = async (e) => {
    //prevent page from refresh
    e.preventDefault();
    axios.defaults.withCredentials = true;
    let data = Object.assign({}, this.state);
    if (document.getElementById('curbside_pickup').checked === true) {
      data.curbside_pickup = 1;
    } else {
      data.curbside_pickup = 0;
    }

    if (document.getElementById('dine_in').checked === true) {
      data.dine_in = 1;
    } else {
      data.dine_in = 0;
    }

    if (document.getElementById('yelp_delivery').checked === true) {
      data.yelp_delivery = 1;
    } else {
      data.yelp_delivery = 0;
    }
    console.log('data');
    console.log(data);

    let mutationResponse = await this.props.updateRestaurantProfileMutation({
      variables: {
        restaurant_id: localStorage.getItem('restaurant_id'),
        email_id: this.state.email_id,
        restaurant_name: this.state.restaurant_name,
        phone_number: this.state.phone_number,
        description: this.state.description,
        zip_code: this.state.zip_code,
        curbside_pickup: this.state.curbside_pickup,
        dine_in: this.state.dine_in,
        yelp_delivery: this.state.yelp_delivery,
        cuisine: this.state.cuisine,
        restaurant_image: this.state.restaurant_image,
        password: this.state.password,
      },
    });
    let response = mutationResponse.data.restaurantProfile;
    if (response.status === '200') {
      document.getElementById('update').blur();
      alert('Profile Updated Successfully!');
    } else {
      alert('Error!!!');
    }
  };

  render() {
    var fileText = this.state.file_text || 'Choose image..';
    if (this.state) {
      var imageSrc = `http://localhost:3002/yelp/images/restaurant/${this.state.restaurant_image}`;
    }
    this.onRefresh();
    return (
      <div>
        <Container fluid={true}>
          <Row>
            <Col xs={6} md={4}>
              <center>
                <br />
                <br />
                <Card style={{ width: '18rem' }}>
                  <Card.Img variant='top' src={imageSrc} />
                  <Card.Body>
                    <Card.Title>
                      <h3>{this.state.restaurant_name}</h3>
                    </Card.Title>
                  </Card.Body>
                </Card>
                <form onSubmit={this.onUpload}>
                  <br />
                  <div className='custom-file' style={{ width: '80%' }}>
                    <input
                      type='file'
                      className='custom-file-input'
                      name='res_image'
                      accept='image/*'
                      onChange={this.onImageChange}
                      required
                    />
                    <label classNameName='custom-file-label' for='res_image'>
                      {fileText}
                    </label>
                  </div>
                  <br />
                  <br />
                  <Button
                    type='submit'
                    variant='primary'
                    style={{ background: '#d32323' }}
                  >
                    Upload
                  </Button>
                </form>
              </center>
            </Col>
            <Col style={{ margin: '2%' }}>
              <h4>Profile</h4>
              <br />
              <Form onSubmit={this.onUpdate}>
                <Form.Row>
                  <Form.Group as={Col} controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      name='restaurant_name'
                      type='text'
                      onChange={this.onChange}
                      value={this.state.restaurant_name}
                      pattern='^[A-Za-z0-9 ]+$'
                      required={true}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId='desc'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      name='description'
                      type='text'
                      onChange={this.onChange}
                      value={this.state.description}
                      pattern='^[A-Za-z ]+$'
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId='email_id'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type='email'
                      name='email_id'
                      value={this.state.email_id}
                      disabled
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId='zip_code'>
                    <Form.Label>ZIP Code</Form.Label>
                    <Form.Control
                      type='text'
                      name='zip_code'
                      onChange={this.onChange}
                      value={this.state.zip_code}
                      pattern='^[0-9]+'
                      required={true}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId='phone_number'>
                    <Form.Label>Contact Info</Form.Label>
                    <Form.Control
                      type='text'
                      name='phone_number'
                      onChange={this.onChange}
                      value={this.state.phone_number}
                      required={true}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId='cuisine'>
                    <Form.Label>Cuisine</Form.Label>
                    <Form.Control
                      type='text'
                      name='cuisine'
                      onChange={this.onChange}
                      value={this.state.cuisine}
                      required={true}
                      placeholder='american, indian, chinese'
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId='delivery'>
                    <Form.Label>Delivery type</Form.Label>
                    <br />
                    Curbside Pickup
                    <input
                      type='checkbox'
                      name='curbside_pickup'
                      id='curbside_pickup'
                      value='curbside_pickup'
                      style={{ margin: '0 10px 0 3px' }}
                    />
                    Dine in
                    <input
                      type='checkbox'
                      name='dine_in'
                      id='dine_in'
                      value='dine_in'
                      style={{ margin: '0 10px 0 3px' }}
                    />
                    Yelp Delivery
                    <input
                      type='checkbox'
                      name='yelp_delivery'
                      id='yelp_delivery'
                      value='yelp_delivery'
                      style={{ margin: '0 10px 0 3px' }}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId='RB.password'>
                    <Form.Label>Change Password</Form.Label>
                    <Form.Control
                      type='password'
                      name='password'
                      onChange={this.onChange}
                      placeholder='New Password'
                    />
                  </Form.Group>
                </Form.Row>
                <br />
                <ButtonGroup aria-label='Third group'>
                  <Button
                    type='submit'
                    variant='success'
                    style={{ background: '#d32323' }}
                    id='update'
                  >
                    Save Changes
                  </Button>
                </ButtonGroup>
                {'  '}
                <ButtonGroup aria-label='Fourth group'>
                  <Link to='/home'>Cancel</Link>
                </ButtonGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default compose(
  graphql(updateRestaurantProfileMutation, {
    name: 'updateRestaurantProfileMutation',
  }),
  withApollo
)(RestaurantProfile);
