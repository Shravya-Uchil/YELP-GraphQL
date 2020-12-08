import React, { Component } from 'react';
import {
  InputGroup,
  FormControl,
  Button,
  DropdownButton,
  Dropdown,
  Alert,
  Col,
  Row,
  Pagination,
} from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Map from '../Map/Map';
import Geocode from 'react-geocode';
import { getPageCount, getPageObjects } from '../../pageutils';
import { getAllRestaurantQuery, getCustomerQuery } from '../../queries/queries';
import { withApollo } from 'react-apollo';

Geocode.setApiKey('AIzaSyAIzrgRfxiIcZhQe3Qf5rIIRx6exhZPwwE');
Geocode.setLanguage('en');
Geocode.setRegion('us');

class CustomerHome extends Component {
  constructor(props) {
    super(props);
    // redux change
    this.state = {
      curPage: 1,
    };

    this.onChange = this.onChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onCuisineSelect = this.onCuisineSelect.bind(this);
    this.onPage = this.onPage.bind(this);
    this.getCustomerInfo();
  }

  onPage = (e) => {
    console.log(e.target);
    console.log(e.target.text);
    this.setState({
      curPage: e.target.text,
    });
  };

  componentWillReceiveProps(nextProps) {
    console.log(
      'We in Customer Home props received, next prop is: ',
      nextProps
    );
  }

  getCustomerInfo = () => {
    this.props.client
      .query({
        query: getCustomerQuery,
        variables: {
          customer_id: localStorage.getItem('customer_id'),
        },
      })
      .then((response) => {
        var result = response.data.customer;
        console.log('got the customer' + JSON.stringify(result));
        if (result.status === '200') {
          this.setState({
            customer: result,
          });

          let addr = 'San Jose';
          if (result.city !== '') {
            addr = result.city;
          }
          Geocode.fromAddress(addr).then(
            (resp) => {
              console.log('Locations');
              console.log(resp.results[0].geometry);
              //console.log(latitude + ", " + longitude);
              let coordinates = {
                lat: resp.results[0].geometry.location.lat,
                lng: resp.results[0].geometry.location.lng,
                address: 'YOU',
              };
              console.log('Coordinates');
              console.log(coordinates);

              this.setState({
                center: coordinates,
              });
            },
            (error) => {
              console.error(error);
            }
          );
        }
      });
  };

  componentDidMount() {
    console.log('MOunt');
    this.props.client
      .query({
        query: getAllRestaurantQuery,
        variables: {
          search_str: '_',
        },
      })
      .then((response) => {
        console.log('got the restaurants');
        var result = response.data.allRestaurant;
        if (result) {
          if (result.message === 'NO_RECORD') {
            this.setState({
              noRecords: true,
              search: '',
            });
          } else {
            this.setState({
              allRestaurants: result.restaurants,
              filteredRestaurants: result.restaurants,
            });
          }
        } else {
          console.log('error');
        }
      });
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      noRecords: 0,
    });
  };

  onCuisineSelect = (e) => {
    let filter = e.target.text;
    if (filter === 'All') {
      this.setState({
        filteredRestaurants: this.state.allRestaurants,
        noRecords: 0,
      });
    } else {
      var filteredList = this.state.allRestaurants.filter(
        (restaurant) => restaurant.cuisine === filter
      );
      this.setState({
        filteredRestaurants: filteredList,
      });
      if (filteredList.length === 0) {
        this.setState({ noRecords: 1 });
      }
    }
  };

  onTypeSelect = (e) => {
    let filter = e.target.text;
    let filteredList = this.state.allRestaurants;
    if (filter === 'All') {
      this.setState({
        noRecords: 0,
      });
    } else if (filter === 'Dine-in') {
      filteredList = this.state.allRestaurants.filter(
        (restaurant) => restaurant.dine_in
      );
    } else if (filter === 'Delivery') {
      filteredList = this.state.allRestaurants.filter(
        (restaurant) => restaurant.yelp_delivery
      );
    } else if (filter === 'Pickup') {
      filteredList = this.state.allRestaurants.filter(
        (restaurant) => restaurant.curbside_pickup
      );
    }
    this.setState({
      filteredRestaurants: filteredList,
    });

    if (filteredList && filteredList.length === 0) {
      this.setState({ noRecords: 1 });
    }
  };

  onSearch = (e) => {
    console.log('in search');
    e.preventDefault();
    this.setState({
      curPage: 1,
    });
    if (this.state) {
      var searchInput =
        typeof this.state.search_input === 'undefined' ||
        this.state.search_input === ''
          ? '_'
          : this.state.search_input;
      this.setState({
        search_input: searchInput,
      });

      this.props.client
        .query({
          query: getAllRestaurantQuery,
          variables: {
            search_str: searchInput,
          },
        })
        .then((response) => {
          console.log('in search query. Response: ');
          console.log(response);
          var result = response.data.allRestaurant;
          if (result) {
            console.log(
              'got the search restaurants: ' + JSON.stringify(result)
            );
            if (result.message === 'NO_RECORD') {
              this.setState({
                noRecords: true,
                search_input: searchInput,
                filteredRestaurants: null,
              });
            } else {
              this.setState({
                filteredRestaurants: result.restaurants,
                noRecords: false,
                search_input: '',
              });
            }
          } else {
            console.log('error');
          }
        });
    }
  };

  render() {
    if (this.state) {
      console.log('render home');
      console.log(this.state);
    }
    let cuisineTag = null;
    let redirectVar = null;
    let messageTag = null;
    let restaurantsTag = null;
    let paginationItemsTag = [];
    console.log('cust' + redirectVar);
    let cusineList = [
      'All',
      'Pizza',
      'Chinese',
      'Indian',
      'Mexican',
      'American',
      'Thai',
      'Burgers',
      'Italian',
      'Stakehouse',
      'Seafood',
      'Korean',
      'Japanese',
      'Breakfast',
      'Sushi',
      'Vietnamese',
      'Sandwiches',
    ];
    cuisineTag = cusineList.map((cuisine) => {
      return (
        <Dropdown.Item href='#' onClick={this.onCuisineSelect}>
          {cuisine}
        </Dropdown.Item>
      );
    });

    let orderTypeList = ['All', 'Dine-in', 'Delivery', 'Pickup'];
    let orderTypeTag = orderTypeList.map((type) => {
      return (
        <Dropdown.Item href='#' onClick={this.onTypeSelect}>
          {type}
        </Dropdown.Item>
      );
    });

    let filteredObjects = [];
    if (this.state && this.state.filteredRestaurants) {
      let count = getPageCount(this.state.filteredRestaurants.length);
      let active = this.state.curPage;
      for (let number = 1; number <= count; number++) {
        paginationItemsTag.push(
          <Pagination.Item key={number} active={number === active}>
            {number}
          </Pagination.Item>
        );
      }
      filteredObjects = getPageObjects(
        this.state.curPage,
        this.state.filteredRestaurants
      );
      restaurantsTag = filteredObjects.map((restaurant) => {
        var imageSrc = `http://localhost:3002/yelp/images/restaurant/${restaurant.restaurant_image}`;
        return (
          <Col sm={3}>
            <Link to={{ pathname: '/restaurant', state: restaurant }}>
              <Card bg='white' style={{ width: '18rem', margin: '5%' }}>
                <Card.Img
                  variant='top'
                  style={{ height: '15rem' }}
                  src={imageSrc}
                />
                <Card.Body>
                  <Card.Title>{restaurant.restaurant_name}</Card.Title>
                  <Card.Text>{restaurant.cuisine}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        );
      });
    }
    if (this.state && this.state.noRecords) {
      console.log(' noRecords - ');
      console.log(this.state);
      messageTag = (
        <Alert variant='warning'>No Results. Please try again.</Alert>
      );
    }

    let center = null;
    let locList = [];
    if (filteredObjects.length) {
      locList = filteredObjects;
    }
    if (this.state && this.state.center) {
      center = this.state.center;
    }
    var location = {
      address: '1919 Fruitdale Avenue',
      lat: 37.31231,
      lng: -121.92534,
    };
    return (
      <div>
        {redirectVar}
        <div>
          <center>
            <br />
            <h3>Search for restaurants!</h3>
            <br />
            <form onSubmit={this.onSearch}>
              <InputGroup style={{ width: '50%', display: 'flex' }} size='lg'>
                <FormControl
                  placeholder='Pizza, Indian, Italian...'
                  aria-label='Search Restaurants'
                  aria-describedby='basic-addon2'
                  name='search_input'
                  onChange={this.onChange}
                />
                <Button
                  variant='primary'
                  type='submit'
                  style={{ background: '#d32323' }}
                >
                  Search
                </Button>
              </InputGroup>
              <br />
              <InputGroup style={{ width: '50%', display: 'flex' }} size='lg'>
                <DropdownButton
                  as={InputGroup.Append}
                  variant='outline-secondary'
                  title='Cuisine'
                  id='input-group-dropdown-2'
                  style={{ float: 'right' }}
                >
                  {cuisineTag}
                </DropdownButton>
                &nbsp;&nbsp;
                <DropdownButton
                  as={InputGroup.Append}
                  variant='outline-secondary'
                  title='Mode of Delivery'
                  id='input-group-dropdown-2'
                  style={{ float: 'right' }}
                >
                  {orderTypeTag}
                </DropdownButton>
              </InputGroup>
            </form>
            <br />
            <br />
            {messageTag}
            <Row>{restaurantsTag}</Row>
            <center>
              <br />
              <br />
              <Pagination
                onClick={this.onPage}
                style={{ display: 'inline-flex' }}
              >
                {paginationItemsTag}
              </Pagination>
            </center>
            <Map locationList={locList} center={location} zoomLevel={10} />
          </center>
        </div>
      </div>
    );
  }
}

export default withApollo(CustomerHome);
