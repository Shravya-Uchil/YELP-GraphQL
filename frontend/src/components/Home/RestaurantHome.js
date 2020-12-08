import React, { Component } from 'react';
import { Card, Container, Col, Row, Button, Pagination } from 'react-bootstrap';
import Reviews from '../Restaurant/RestaurantReview.js';
import ItemCard from '../Restaurant/Item';
import { Link } from 'react-router-dom';
import { getPageCount, getPageObjects } from '../../pageutils';
import {
  getCategoriesForRestaurantQuery,
  getItemsForRestaurantQuery,
  getRestaurantProfileQuery,
} from '../../queries/queries';
import { withApollo } from 'react-apollo';

class RestaurantHome extends Component {
  constructor(props) {
    super(props);

    this.ItemsForCategory = this.ItemsForCategory.bind(this);
    this.getAllMenuItems = this.getAllMenuItems.bind(this);
    this.getAllCategories = this.getAllCategories.bind(this);
    this.onPage = this.onPage.bind(this);
    this.calculatePages = this.calculatePages.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.getAllMenuItems();
    this.getAllCategories();
  }

  onPage = (e) => {
    this.setState({
      curPage: e.target.text,
    });
  };

  componentWillMount() {
    console.log('Get restaurant');
    this.setState({
      curPage: 1,
    });

    this.props.client
      .query({
        query: getRestaurantProfileQuery,
        variables: {
          restaurant_id: localStorage.getItem('restaurant_id'),
        },
      })
      .then((response) => {
        var result = response.data.restaurant;
        if (result) {
          if (result.status === '200') {
            this.setState({
              restaurant: result,
            });
          }
        } else {
          console.log('error: ', result.message);
        }
      });
  }

  getAllCategories = () => {
    this.props.client
      .query({
        query: getCategoriesForRestaurantQuery,
        variables: {
          restaurant_id: localStorage.getItem('restaurant_id'),
        },
      })
      .then((response) => {
        console.log('got the category');
        console.log(response);
        var result = response.data.menuCategory;
        if (result) {
          if (result.status === '200') {
            this.setState({
              menu_category: result.menu_categories,
            });
          }
        } else {
          console.log('error: ', result.message);
        }
      });
  };

  getAllMenuItems = () => {
    this.props.client
      .query({
        query: getItemsForRestaurantQuery,
        variables: {
          restaurant_id: localStorage.getItem('restaurant_id'),
        },
      })
      .then((response) => {
        console.log('got the items');
        console.log(response);
        var result = response.data.menuItem;
        if (result) {
          if (result.status === '200') {
            this.setState({
              menu_items: result.items,
            });
          }
        } else {
          console.log('error: ', result.message);
        }
      });
  };

  ItemsForCategory = (menu_category) => {
    console.log('filter item for:');

    console.log('menu_category');
    console.log(menu_category);

    console.log('this.state.menu_items');
    console.log(this.state.menu_items);
    var itemsSection = [];

    if (
      menu_category &&
      menu_category.items &&
      menu_category.items.length > 0
    ) {
      var tag = <h4>{menu_category.category.category_name}</h4>;
      itemsSection.push(tag);
      for (var i = 0; i < menu_category.items.length; i++) {
        var item = <ItemCard menu_item={menu_category.items[i]} />;
        itemsSection.push(item);
      }
      return itemsSection;
    }
  };

  componentWillReceiveProps(nextProps) {
    console.log(
      'We in Restaurant Home props received, next prop is: ',
      nextProps
    );
  }

  calculatePages() {
    if (this.state.menu_items && this.state.menu_items.length > 0) {
      let count = getPageCount(this.state.menu_items.length, 4);
      let active = this.state.curPage;
      let paginationItemsTag = [];
      for (let number = 1; number <= count; number++) {
        paginationItemsTag.push(
          <Pagination.Item key={number} active={number === active}>
            {number}
          </Pagination.Item>
        );
      }
      return paginationItemsTag;
    }
  }

  getCategories() {
    let categories = this.state.menu_category;
    let items = this.state.menu_items;
    if (!items || !categories) {
      return [];
    }
    let i = 0;
    let list = [];
    for (i = 0; i < categories.length; i++) {
      var filteredItems = items.filter(
        (_item) => _item.item_category === categories[i].id
      );
      let data = { category: categories[i], items: [] };
      data.items = filteredItems;
      list.push(data);
    }
    let curPage = this.state.curPage;
    let pageSize = 4;
    let start = pageSize * (curPage - 1);
    let end = start + pageSize;
    let count = 0;
    let startCount = 0;
    let filteredList = [];
    let insert = false;
    for (i = 0; i < list.length; i++) {
      insert = false;
      let data = { category: list[i].category, items: [] };
      for (var j = 0; j < list[i].items.length; j++) {
        if (startCount >= start) {
          insert = true;
          data.items.push(list[i].items[j]);
          count++;
        }
        if (count === pageSize) {
          filteredList.push(data);
          //console.log(filteredList);
          return filteredList;
        }
        startCount++;
      }
      if (insert) {
        filteredList.push(data);
      }
      if (count === pageSize) {
        //console.log(filteredList);
        return filteredList;
      }
    }

    //console.log(filteredList);
    return filteredList;
  }

  render() {
    let redirectVar = null;
    let restaurantDetails = null;
    let reviews = null;
    let category = null;
    let menuTag = [];
    let paginationItemsTag = [];
    if (this.state && this.state.restaurant) {
      console.log('state');
      let restaurant = this.state.restaurant;
      console.log(restaurant);
      let resImageSrc = `http://localhost:3002/yelp/images/restaurant/${this.state.restaurant.restaurant_image}`;
      restaurantDetails = (
        <Card
          bg='light'
          text='dark'
          style={{
            width: '70rem',
            height: '20rem',
            margin: '2%',
          }}
        >
          <Row>
            <Col>
              <Card.Img
                style={{ width: '20rem', height: '20rem' }}
                src={resImageSrc}
              />
            </Col>
            <Col>
              <Card.Body>
                <Card.Title>
                  <h1>{restaurant.restaurant_name}</h1>
                </Card.Title>
                <br />
                <Card.Text>
                  <h4>
                    {restaurant.phone_number} | {restaurant.zip_code}
                  </h4>
                </Card.Text>
                <br />
                <Card.Text>
                  <h4>Cuisine: {restaurant.cuisine}</h4>
                </Card.Text>
                <br />
                <Card.Text>
                  <h4>Description: {restaurant.description}</h4>
                </Card.Text>
                <br />
              </Card.Body>
            </Col>
          </Row>
        </Card>
      );
      reviews = <Reviews restaurant_details={restaurant} />;
    }
    if (
      this.state &&
      this.state.menu_category &&
      this.state.menu_category.length > 0
    ) {
      paginationItemsTag = this.calculatePages();
      let filteredList = this.getCategories();
      console.log('*************************************');
      console.log(filteredList);
      console.log('*************************************');
      for (var i = 0; i < filteredList.length; i++) {
        category = this.ItemsForCategory(filteredList[i]);
        menuTag.push(category);
      }
    }
    return (
      <div>
        {redirectVar}
        <div>
          <Container className='justify-content'>
            <br />
            {restaurantDetails}
            <Link to={{ pathname: '/additem' }}>
              <Button
                variant='primary'
                name='add_item'
                style={{ background: '#d32323' }}
              >
                Add More Items
              </Button>
            </Link>
            <Container>{menuTag}</Container>
            <center>
              <Pagination
                onClick={this.onPage}
                style={{ display: 'inline-flex' }}
              >
                {paginationItemsTag}
              </Pagination>
            </center>
            <b>Reviews</b>
            <Container>{reviews}</Container>
          </Container>
        </div>
      </div>
    );
  }
}

export default withApollo(RestaurantHome);
