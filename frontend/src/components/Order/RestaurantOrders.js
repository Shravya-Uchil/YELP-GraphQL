import React, { Component } from 'react';
import {
  Card,
  Container,
  Col,
  Row,
  Button,
  Alert,
  Dropdown,
  DropdownButton,
  Pagination,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavBar from '../LandingPage/Navbar.js';
import { Redirect } from 'react-router';
import { getPageCount, getPageObjects } from '../../pageutils';
import { getRestaurantOrderQuery } from '../../queries/queries';
import {
  updateDeliveryStatusMutation,
  updateOrderStatusMutation,
} from '../../mutation/mutations';
import { withApollo, graphql } from 'react-apollo';
import * as compose from 'lodash.flowright';

class RestaurantOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveryStateValue: 'Change Delivery Status',
      stateValue: 'Change Order Status',
      filter_title: 'Order Status',
      noRecords: 0,
      curPage: 1,
    };

    this.changeStateValue = this.changeStateValue.bind(this);
    this.changeDeliveryStateValue = this.changeDeliveryStateValue.bind(this);
    this.onUpdateDelivery = this.onUpdateDelivery.bind(this);
    this.onFilterSelect = this.onFilterSelect.bind(this);
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
        query: getRestaurantOrderQuery,
        variables: {
          restaurant_id: localStorage.getItem('restaurant_id'),
        },
      })
      .then((response) => {
        var result = response.data.restaurantOrder;
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
        }
      });
  };

  changeDeliveryStateValue = (e, id) => {
    this.setState({
      deliveryStateValue: e.target.text,
      order_delivery_status: e.target.text,
      order_delivery_status_id: id,
    });
  };

  changeStateValue = (e, id) => {
    console.log('state');
    console.log(e.target);
    this.setState({
      stateValue: e.target.text,
      order_status: e.target.text,
      order_status_id: id,
    });
    console.log(this.state);
  };

  onUpdateDelivery = async (e) => {
    console.log('delivery');
    console.log(e.target);
    console.log(this.state);
    if (
      this.state &&
      this.state.order_delivery_status &&
      this.state.order_delivery_status_id === e.target.id
    ) {
      let mutationResponse = await this.props.updateDeliveryStatusMutation({
        variables: {
          order_id: this.state.order_status_id,
          order_delivery_status: this.state.order_delivery_status,
        },
      });
      let response = mutationResponse.data.updateDeliveryStatus;
      if (response.status === '200') {
        let orders = this.state.orders_history_filtered;
        for (let i = 0; i < orders.length; i++) {
          if (orders[i].order_id === this.state.order_delivery_status_id) {
            orders[i].order_delivery_status = this.state.order_delivery_status;
            break;
          }
        }
        this.forceUpdate();
      } else {
        console.log('error, ', response.message);
      }
    } else {
      alert('Please change the delivery status to update.');
    }
  };

  onUpdateOrder = async (e) => {
    console.log('order');
    console.log(e.target);
    console.log(this.state);
    if (
      this.state &&
      this.state.order_status &&
      this.state.order_status_id === e.target.id
    ) {
      let mutationResponse = await this.props.updateOrderStatusMutation({
        variables: {
          order_id: this.state.order_status_id,
          order_status: this.state.order_status,
        },
      });
      let response = mutationResponse.data.updateOrderStatus;
      if (response.status === '200') {
        let orders = this.state.orders_history_filtered;
        for (let i = 0; i < orders.length; i++) {
          if (orders[i].order_id === this.state.order_status_id) {
            orders[i].order_status = this.state.order_status;
            break;
          }
        }
        this.forceUpdate();
      } else {
        console.log('error, ', response.message);
      }
    } else {
      alert('Please change the order status to update.');
    }
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
        (order) => order.order_status === filter
      );
      this.setState({
        orders_history_filtered: filteredList,
      });
      if (filteredList.length === 0) {
        this.setState({ noRecords: 1 });
      }
    }
  };

  componentWillReceiveProps(nextProps) {
    console.log(
      'We in Restaurant Home props received, next prop is: ',
      nextProps
    );
    if (nextProps.orders && nextProps.orders === 'UPDATED_ORDER_STATUS') {
      console.log('order status updated');
      console.log(nextProps);
      let orders = this.state.orders_history_filtered;
      for (let i = 0; i < orders.length; i++) {
        if (orders[i].order_id === this.state.order_status_id) {
          orders[i].order_status = this.state.order_status;
          break;
        }
      }
      //this.forceUpdate();
    } else if (
      nextProps.orders &&
      nextProps.orders === 'UPDATED_DELIVERY_STATUS'
    ) {
      console.log('delivery status updated');
      console.log(nextProps);
      let orders = this.state.orders_history_filtered;
      for (let i = 0; i < orders.length; i++) {
        if (orders[i].order_id === this.state.order_delivery_status_id) {
          orders[i].order_delivery_status = this.state.order_delivery_status;
          break;
        }
      }
      //this.forceUpdate();
    } else if (nextProps.orders) {
      if (nextProps.orders[0]) {
        this.setState({
          orders_history: nextProps.orders,
          orders_history_filtered: nextProps.orders,
          noRecords: 0,
        });
      }
    } else {
      console.log('Redux error. Props:');
      console.log(nextProps);
    }
  }

  render() {
    let message = null;
    let orderCards = null;
    let redirectVar = null;
    let paginationItemsTag = [];
    if (!localStorage.getItem('restaurant_id')) {
      redirectVar = <Redirect to='/login' />;
    }

    let order_status_filter = [
      'All',
      'New Order',
      'Delivered Order',
      'Cancelled Order',
    ];
    let status_tag = order_status_filter.map((status) => {
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
          let delivery_details = null;
          let details = null;
          if (order.order_type === 'DELIVERY') {
            details = [
              'Order Received',
              'Preparing',
              'On the way',
              'Delivered',
            ];
          } else {
            details = [
              'Order Received',
              'Preparing',
              'Pick up ready',
              'Picked up',
            ];
          }
          delivery_details = details.map((d) => {
            return (
              <Dropdown.Item
                href='#'
                onClick={(e) =>
                  this.changeDeliveryStateValue(e, order.order_id)
                }
              >
                {d}
              </Dropdown.Item>
            );
          });

          let order_status = (details = [
            'New Order',
            'Delivered Order',
            'Cancelled Order',
          ]);
          let order_status_tag = details.map((d) => {
            return (
              <Dropdown.Item
                href='#'
                onClick={(e) => this.changeStateValue(e, order.order_id)}
              >
                {d}
              </Dropdown.Item>
            );
          });
          console.log('render');
          console.log(order);

          return (
            <Card
              style={{ width: '70rem', margin: '2%' }}
              bg='white'
              text='dark'
            >
              <Row>
                <Col>
                  <Card.Body>
                    <Card.Text>
                      Customer Name:{' '}
                      <Link
                        to={{
                          pathname: '/customercard',
                          state: { id: order.customer_id },
                        }}
                      >
                        {' '}
                        {order.cust_name}
                      </Link>
                    </Card.Text>
                    <Card.Text>Order Date: {order.order_date}</Card.Text>
                    <Card.Text>Order Price: {order.order_cost}</Card.Text>
                    <Card.Text>Order Type: {order.order_type}</Card.Text>
                    <Card.Text>
                      <b>Order Status: </b> {order.order_status}
                    </Card.Text>
                    <Card.Text>
                      <b>Delivery Status: </b> {order.order_delivery_status}
                    </Card.Text>
                  </Card.Body>
                </Col>
                <Col sm={3} align='center'>
                  <Row sm={3}>
                    <Card.Body>
                      <Card.Title>
                        <DropdownButton
                          id={order.order_id}
                          title={this.state.stateValue}
                          variant='outline-secondary'
                        >
                          {order_status_tag}
                        </DropdownButton>
                      </Card.Title>
                    </Card.Body>
                  </Row>
                  <Row>
                    <Card.Body>
                      <Card.Title>
                        <Button
                          variant='primary'
                          onClick={this.onUpdateOrder}
                          style={{ background: '#d32323' }}
                          id={order.order_id}
                        >
                          Update Order Status
                        </Button>
                      </Card.Title>
                    </Card.Body>
                  </Row>
                </Col>
                <Col sm={3}>
                  <Row sm={3}>
                    <Card.Body>
                      <Card.Title>
                        <DropdownButton
                          variant='outline-secondary'
                          id='dropdown-dstatus-button'
                          title={this.state.deliveryStateValue}
                        >
                          {delivery_details}
                        </DropdownButton>
                      </Card.Title>
                    </Card.Body>
                  </Row>
                  <Row>
                    <Card.Body>
                      <Card.Title>
                        <Button
                          variant='primary'
                          onClick={this.onUpdateDelivery}
                          style={{ background: '#d32323' }}
                          id={order.order_id}
                        >
                          Update Delivery Status
                        </Button>
                      </Card.Title>
                    </Card.Body>
                  </Row>
                </Col>
              </Row>
            </Card>
          );
        });
      }
    } else {
      message = <Alert variant='warning'>No orders available!!!</Alert>;
    }
    return (
      <div>
        {redirectVar}
        <div>
          <NavBar />
          <Container>
            <h3>Orders</h3> <br />
            {message}
            <DropdownButton
              variant='outline-secondary'
              title={this.state.filter_title}
              id='input-group-dropdown-2'
              style={{ float: 'left' }}
            >
              {status_tag}
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

export default compose(
  graphql(updateDeliveryStatusMutation, {
    name: 'updateDeliveryStatusMutation',
  }),
  graphql(updateOrderStatusMutation, {
    name: 'updateOrderStatusMutation',
  }),
  withApollo
)(RestaurantOrders);
