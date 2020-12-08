import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Col,
  Row,
  Form,
  Button,
  ButtonGroup,
  Card,
} from 'react-bootstrap';
import { getCustomerQuery } from '../../queries/queries';
import { updateCustomerProfileMutation } from '../../mutation/mutations';
import { withApollo, graphql } from 'react-apollo';
import * as compose from 'lodash.flowright';

class CustomerProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }

  componentWillMount() {
    console.log('We are here, emailid is ' + localStorage.getItem('email_id'));

    this.props.client
      .query({
        query: getCustomerQuery,
        variables: {
          customer_id: localStorage.getItem('customer_id'),
        },
      })
      .then((response) => {
        var customer = response.data.customer;
        console.log('got the customer' + JSON.stringify(customer));
        if (customer.status === '200') {
          var customerData = {
            cust_name: customer.cust_name || this.state.cust_name,
            email_id: customer.email_id || this.state.email_id,
            city: customer.city || this.state.city,
            state: customer.state || this.state.state,
            country: customer.country || this.state.country,
            phone_number: customer.phone_number || this.state.phone_number,
            cust_image: customer.cust_image || this.state.cust_image,
            dob: customer.dob || this.state.dob,
            nick_name: customer.nick_name || this.state.nick_name,
            headline: customer.headline || this.state.headline,
            yelp_since: customer.yelp_since || this.state.yelp_since,
            things_love: customer.things_love || this.state.things_love,
            find_me: customer.find_me || this.state.find_me,
            blog_website: customer.blog_website || this.state.blog_website,
            customer_id: customer.customer_id || this.state.customer_id,
          };
          this.setState(customerData);
        }
      });
  }

  componentWillReceiveProps(nextProps) {
    console.log('We in props received, next prop is: ', nextProps);
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onImageChange = (e) => {
    this.setState({
      file: e.target.files[0],
      file_text: e.target.files[0].name,
    });
  };

  onUpdate = async (e) => {
    //prevent page from refresh
    e.preventDefault();

    let mutationResponse = await this.props.updateCustomerProfileMutation({
      variables: {
        customer_id: localStorage.getItem('customer_id'),
        email_id: this.state.email_id,
        cust_name: this.state.cust_name,
        city: this.state.city,
        state: this.state.state,
        country: this.state.country,
        nick_name: this.state.nick_name,
        headline: this.state.headline,
        yelp_since: this.state.yelp_since,
        dob: this.state.dob,
        things_love: this.state.things_love,
        find_me: this.state.find_me,
        blog_website: this.state.blog_website,
        phone_number: this.state.phone_number,
        password: this.state.password,
      },
    });
    let response = mutationResponse.data.customerProfile;
    if (response.status === '200') {
      document.getElementById('update').blur();
      alert('Profile Updated Successfully!');
    } else {
      alert('Error!!!');
    }
  };

  render() {
    var imageSrc;
    var fileText = this.state.file_text || 'Choose image..';
    if (this.state) {
      imageSrc = `http://localhost:3002/yelp/images/customer/${this.state.cust_image}`;
    }
    return (
      <div>
        <Container fluid={true}>
          <Row>
            <Col class='col-md-3 col-3' style={{ margin: '2%' }}>
              <center>
                <Card style={{ width: '15rem' }}>
                  <Card.Img variant='top' src={imageSrc} />
                  <Card.Body>
                    <Card.Title>
                      <h3>{this.state.cust_name}</h3>
                    </Card.Title>
                  </Card.Body>
                </Card>
                <br />
                <form onSubmit=''>
                  <div class='custom-file' style={{ width: '80%' }}>
                    <input
                      type='file'
                      class='custom-file-input'
                      name='cust_image'
                      accept='image/*'
                      onChange={this.onImageChange}
                      required
                    />
                    <label class='custom-file-label' for='cust_image'>
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
            <Col class='col-md-4 col-4' style={{ margin: '2%' }} xs={6} md={4}>
              <h4>Basic Details</h4>
              <br />
              <Card style={{ width: '25rem' }}>
                <Card.Body>
                  <Form>
                    <Form.Row>
                      <Form.Group as={Col} controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          name='cust_name'
                          type='text'
                          pattern='^[A-Za-z0-9 ]+$'
                          required={true}
                          value={this.state.cust_name}
                          onChange={this.onChange}
                          autocomplete='off'
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId='dob'>
                        <Form.Label>Date Of Birth</Form.Label>
                        <Form.Control
                          name='dob'
                          type='date'
                          value={this.state.dob}
                          onChange={this.onChange}
                          autocomplete='off'
                          required
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId='city'>
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          name='city'
                          type='text'
                          value={this.state.city}
                          onChange={this.onChange}
                          autocomplete='off'
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId='state'>
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          name='state'
                          type='text'
                          value={this.state.state}
                          onChange={this.onChange}
                          autocomplete='off'
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId='country'>
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                          name='country'
                          type='text'
                          value={this.state.country}
                          onChange={this.onChange}
                          autocomplete='off'
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId='nickname'>
                        <Form.Label>Nickname</Form.Label>
                        <Form.Control
                          name='nick_name'
                          type='text'
                          value={this.state.nick_name}
                          onChange={this.onChange}
                          autocomplete='off'
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId='headline'>
                        <Form.Label>Headline</Form.Label>
                        <Form.Control
                          name='headline'
                          type='text'
                          value={this.state.headline}
                          onChange={this.onChange}
                          autocomplete='off'
                        />
                      </Form.Group>
                    </Form.Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col class='col-md-3 col-3' style={{ margin: '2%' }}>
              <h4>About</h4>
              <br />
              <Card style={{ width: '25rem' }}>
                <Card.Body>
                  <Form>
                    <Form.Row>
                      <Form.Group as={Col} controlId='yelp_since'>
                        <Form.Label>Yelping Since</Form.Label>
                        <Form.Control
                          name='yelp_since'
                          type='date'
                          value={this.state.yelp_since}
                          onChange={this.onChange}
                          autocomplete='off'
                          required
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId='things_love'>
                        <Form.Label>Things I Love</Form.Label>
                        <Form.Control
                          name='things_love'
                          type='text'
                          value={this.state.things_love}
                          onChange={this.onChange}
                          autocomplete='off'
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId='find_me'>
                        <Form.Label>Find Me In</Form.Label>
                        <Form.Control
                          name='find_me'
                          type='text'
                          value={this.state.find_me}
                          onChange={this.onChange}
                          autocomplete='off'
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId='blog_website'>
                        <Form.Label>My Blog or Website</Form.Label>
                        <Form.Control
                          name='blog_website'
                          type='text'
                          value={this.state.blog}
                          onChange={this.onChange}
                          autocomplete='off'
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId='phone_number'>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type='text'
                          name='phone_number'
                          value={this.state.phone_number}
                          onChange={this.onChange}
                          autocomplete='off'
                          pattern='^[0-9]+$'
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
                      <Form.Group as={Col} controlId='RB.password'>
                        <Form.Label>Change Password</Form.Label>
                        <Form.Control
                          type='password'
                          name='password'
                          onChange={this.onChange}
                          placeholder='New Password'
                          required={true}
                          autocomplete='off'
                        />
                      </Form.Group>
                    </Form.Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <center>
              <ButtonGroup aria-label='Third group'>
                <Button
                  variant='success'
                  style={{ background: '#d32323' }}
                  id='update'
                  onClick={this.onUpdate}
                >
                  Save Changes
                </Button>
              </ButtonGroup>
              {'  '}
              <ButtonGroup aria-label='Fourth group'>
                <Link to='/login'>Cancel</Link>
              </ButtonGroup>
            </center>
          </Row>
          <br />
        </Container>
      </div>
    );
  }
}

export default compose(
  graphql(updateCustomerProfileMutation, {
    name: 'updateCustomerProfileMutation',
  }),
  withApollo
)(CustomerProfile);
