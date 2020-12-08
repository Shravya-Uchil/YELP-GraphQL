import React, { Component } from 'react';
import { Col, Row, Button, Alert } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import NavBar from '../LandingPage/Navbar.js';

import { getCustomerQuery } from '../../queries/queries';
import { withApollo } from 'react-apollo';

class CustomerCard extends Component {
  constructor(props) {
    super(props);
    // redux change
    this.state = {};
    this.setState({
      disable: false,
      buttonName: 'Follow',
      msgButtonName: 'Message',
    });
    this.enableButton = this.enableButton.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    this.enableButton();
    this.setState({
      disable: false,
      buttonName: 'Follow',
    });

    this.props.client
      .query({
        query: getCustomerQuery,
        variables: {
          customer_id: this.props.location.state.id,
        },
      })
      .then((response) => {
        var customer = response.data.customer;
        console.log('got the customer' + JSON.stringify(customer));
        if (customer.status === '200') {
          this.setState({
            customer: customer,
          });
        }
      });
  }

  componentWillReceiveProps(nextProps) {
    console.log('We in props received, next prop is: ', nextProps);
  }

  onClick = (e) => {};

  enableButton() {
    if (localStorage.getItem('customer_id') != this.props.location.state.id) {
      this.setState({
        disable: false,
      });
    }
  }

  render() {
    console.log('render cust card');
    console.log(this.state);
    let redirectVar = null;
    let customerTag = null;

    let disable = this.state.disable;
    let buttonName = this.state.buttonName;
    let buttonTag = null;
    let messageTag = null;
    if (this.state && this.state.customer) {
      var imgSrc = `http://localhost:3002/yelp/images/customer/${this.state.customer.cust_image}`;
      console.log('Check if already following');
      console.log(this.state.customer);
      if (
        this.state.customer.followers &&
        this.state.customer.followers.length > 0
      ) {
        let idx = this.state.customer.followers.indexOf(
          localStorage.getItem('customer_id')
        );
        console.log(idx);
        if (idx != -1) {
          disable = true;
          buttonName = 'Following';
        }
      }

      customerTag = (
        <Row>
          <Col sm={2}>
            <Card
              bg='light'
              text='dark'
              style={{ width: '70rem', height: '25rem', margin: '2%' }}
            >
              <Card.Img variant='top' style={{ width: '15rem' }} src={imgSrc} />
              <Card.Title>{this.state.customer.cust_name || ''}</Card.Title>
            </Card>
          </Col>
          <Col sm={2}>
            <Card
              bg='light'
              text='dark'
              style={{ width: '70rem', height: '25rem', margin: '2%' }}
            >
              <Card.Body>
                <Card.Text>
                  Nick name: {this.state.customer.nick_name || ''}
                </Card.Text>
                <Card.Text>City: {this.state.customer.city || ''}</Card.Text>
                <Card.Text>State: {this.state.customer.state || ''}</Card.Text>
                <Card.Text>
                  Country: {this.state.customer.country || ''}
                </Card.Text>
                <Card.Text>
                  Phone no: {this.state.customer.phone_number || ''}
                </Card.Text>
                <Card.Text>Bio: {this.state.customer.headline || ''}</Card.Text>
                {buttonTag}
                {messageTag}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      );
    }
    return (
      <div>
        {redirectVar}
        <NavBar />
        <div>{customerTag}</div>
      </div>
    );
  }
}
//export Home Component
export default withApollo(CustomerCard);
