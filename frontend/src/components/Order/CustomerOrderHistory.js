import React, { Component } from 'react';
import {
  Card,
  Container,
  Alert,
  Dropdown,
  DropdownButton,
  Pagination,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavBar from '../LandingPage/Navbar.js';
import { Redirect } from 'react-router';
import serverAddress from '../../config';
import { getPageCount, getPageObjects } from '../../pageutils';
import { withApollo } from 'react-apollo';
import { getCustomerOrderQuery } from '../../queries/queries';

class CustomerOrderHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter_title: 'Order Delivery Status',
      curPage: 1,
    };
    this.onPage = this.onPage.bind(this);
    this.getOrderHistory();
  }

  componentWillMount() {
    this.setState({
      curPage: 1,
    });
  }

  onPage = (e) => {
    console.log(e.target);
    console.log(e.target.text);
    this.setState({
      curPage: e.target.text,
    });
  };

  getOrderHistory = () => {
    this.props.client
      .query({
        query: getCustomerOrderQuery,
        variables: {
          customer_id: localStorage.getItem('customer_id'),
        },
      })
      .then((response) => {
        var result = response.data.customerOrder;
        if (result) {
          if (result.status === '200') {
            this.setState({
              orders_history: result.orders,
              orders_history_filtered: result.orders,
              noRecords: 0,
            });
          }
        } else {
          console.log('error: ', result.message);
          this.setState({
            message: result.message,
          });
        }
      });
  };

  onFilterSelect = (e) => {
    this.setState({
      filter_title: e.target.text,
    });
    let filter = e.target.text;
    if (filter === 'All') {
      this.setState({
        orders_history_filtered: this.state.orders_history,
        noRecords: 0,
      });
    } else {
      var filteredList = this.state.orders_history.filter(
        (order) => order.order_delivery_status === filter
      );
      this.setState({
        orders_history_filtered: filteredList,
      });
      if (filteredList.length === 0) {
        this.setState({ noRecords: 1 });
      }
    }
  };

  render() {
    let message = null;
    let orderCards = null;
    let redirectVar = null;
    let paginationItemsTag = [];
    if (!localStorage.getItem('customer_id')) {
      redirectVar = <Redirect to='/login' />;
    }

    let delivery_status_filter = [
      'All',
      'Order Received',
      'Preparing',
      'On the way',
      'Delivered',
      'Pick up ready',
      'Picked up',
    ];
    let delivery_tag = delivery_status_filter.map((status) => {
      return (
        <Dropdown.Item href='#' onClick={this.onFilterSelect}>
          {status}
        </Dropdown.Item>
      );
    });

    if (this.state && this.state.noRecords) {
      message = <Alert variant='warning'>No Results. Please try again.</Alert>;
    }

    if (this.state && this.state.orders_history_filtered) {
      if (this.state.orders_history_filtered.length > 0) {
        // Pagination
        let count = getPageCount(this.state.orders_history_filtered.length);
        let active = this.state.curPage;
        for (let number = 1; number <= count; number++) {
          paginationItemsTag.push(
            <Pagination.Item key={number} active={number === active}>
              {number}
            </Pagination.Item>
          );
        }
        let filteredObjects = getPageObjects(
          this.state.curPage,
          this.state.orders_history_filtered
        );

        orderCards = filteredObjects.map((order) => {
          return (
            <Card
              style={{ width: '50rem', margin: '2%' }}
              bg='white'
              text='dark'
            >
              <center>
                <Card.Title>{order.restaurant_name}</Card.Title>
              </center>
              <Card.Body>
                <Card.Text>Order date: {order.order_date}</Card.Text>
                <Card.Text>Total: {order.order_cost}</Card.Text>
                <Card.Text>
                  <b>Delivery Status: </b> {order.order_delivery_status}
                </Card.Text>
                <Card.Text>
                  <b>Order Status: </b> {order.order_status}
                </Card.Text>
              </Card.Body>
            </Card>
          );
        });
      }
    } else {
      message = (
        <Alert variant='warning'>
          You do not have any orders made in the past.
        </Alert>
      );
    }
    return (
      <div>
        {redirectVar}
        <div>
          <NavBar />
          <Container className='justify-content'>
            <h3>Orders History</h3> <br />
            {message}
            <DropdownButton
              variant='outline-secondary'
              title={this.state.filter_title}
              id='input-group-dropdown-2'
              style={{ float: 'left' }}
            >
              {delivery_tag}
            </DropdownButton>
            <br />
            <br />
            {orderCards}
            <br />
            <br />
            <Pagination
              onClick={this.onPage}
              style={{ display: 'inline-flex' }}
            >
              {paginationItemsTag}
            </Pagination>
          </Container>
        </div>
      </div>
    );
  }
}

export default withApollo(CustomerOrderHistory);
