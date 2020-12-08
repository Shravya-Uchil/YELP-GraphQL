import React, { Component } from 'react';
import {
  Container,
  Col,
  Row,
  Form,
  Button,
  ButtonGroup,
  Card,
} from 'react-bootstrap';
import { Redirect } from 'react-router';
import NavBar from '../LandingPage/Navbar.js';
import { addItemMutation } from '../../mutation/mutations';
import { getMenuCategoryByIdQuery } from '../../queries/queries';
import { withApollo, graphql } from 'react-apollo';
import * as compose from 'lodash.flowright';

class AddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item_id: null,
      item_image: null,
    };

    this.onChange = this.onChange.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onUpload = this.onUpload.bind(this);
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  componentDidMount() {
    console.log('mountt');
    console.log(this.props);
    if (this.props.location.state) {
      var item = {
        item_id:
          this.props.location.state.item_id || this.props.location.state.id,
        item_name: this.props.location.state.item_name,
        item_price: this.props.location.state.item_price,
        item_description: this.props.location.state.item_description,
        item_ingredients: this.props.location.state.item_ingredients,
        item_image: this.props.location.state.item_image,
      };

      this.setState(item);

      this.props.client
        .query({
          query: getMenuCategoryByIdQuery,
          variables: {
            menu_category_id: this.props.location.state.item_category,
          },
        })
        .then((response) => {
          console.log('response');
          console.log(response);
          var result = response.data.menuCategoryById;
          if (result) {
            if (result.status === '200') {
              this.setState({
                item_category: result.category_name,
              });
            }
          } else {
            console.log('error: ', result.message);
          }
        });
    }
  }

  onAdd = async (e) => {
    //prevent page from refresh
    e.preventDefault();

    console.log('Add item, state');
    console.log(this.state);

    let mutationResponse = await this.props.addItemMutation({
      variables: {
        item_category: this.state.item_category,
        restaurant_id: localStorage.getItem('restaurant_id'),
        item_id: this.state.item_id,
        item_name: this.state.item_name,
        item_description: this.state.item_description,
        item_price: this.state.item_price,
        item_image: this.state.item_image,
        item_ingredients: this.state.item_ingredients,
      },
    });
    console.log('mutationResponse');
    console.log(mutationResponse);
    let response = mutationResponse.data.addItem;

    if (response.status === '200') {
      alert('Item Added!');
      console.log(response);
      this.setState({
        isAddDone: 1,
        item_id: response.id,
      });
    } else {
      console.log('error, ', response.message);
    }
  };

  onUpload = (e) => {
    e.preventDefault();
  };

  onImageChange = (e) => {
    this.setState({
      file: e.target.files[0],
      file_text: e.target.files[0].name,
    });
  };

  render() {
    let redirectVar = null;
    if (!localStorage.getItem('restaurant_id')) {
      redirectVar = <Redirect to='/login' />;
    }

    console.log('render');
    console.log(this.state);
    console.log(this.props.location.state);
    var imageSrc;
    var fileText = this.state.file_text || 'Choose image..';
    if (this.state) {
      imageSrc = `http://localhost:3002/yelp/images/item/${this.state.item_image}`;
    }
    return (
      <div>
        {redirectVar}
        <NavBar />
        <Container fluid={true}>
          <Row>
            <Col xs={6} md={4}>
              <center>
                <Card style={{ width: '18rem', margin: '5%' }}>
                  <Card.Img variant='top' src={imageSrc} />
                  <Card.Body>
                    <Card.Title>
                      <h3>{this.state.item_name}</h3>
                    </Card.Title>
                  </Card.Body>
                </Card>
                <form onSubmit={this.onUpload}>
                  <br />
                  <div class='custom-file' style={{ width: '80%' }}>
                    <input
                      type='file'
                      class='custom-file-input'
                      name='item_image'
                      accept='image/*'
                      onChange={this.onImageChange}
                      required
                    />
                    <label class='custom-file-label' for='item_image'>
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
              <h4>Add/Update Item</h4>
              <br />
              <Form onSubmit={this.onAdd}>
                <Form.Row>
                  <Form.Group as={Col} controlId='item_name'>
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control
                      name='item_name'
                      type='text'
                      pattern='^[A-Za-z0-9 ]+$'
                      required={true}
                      onChange={this.onChange}
                      autocomplete='off'
                      value={this.state.item_name}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId='description'>
                    <Form.Label>Item Description</Form.Label>
                    <Form.Control
                      name='item_description'
                      type='text'
                      pattern='^[A-Za-z0-9 ]+$'
                      required={true}
                      onChange={this.onChange}
                      autocomplete='off'
                      value={this.state.item_description}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId='ingredients'>
                    <Form.Label>Item Ingredients</Form.Label>
                    <Form.Control
                      name='item_ingredients'
                      type='text'
                      pattern='^[A-Za-z0-9 ]+$'
                      required={true}
                      onChange={this.onChange}
                      autocomplete='off'
                      value={this.state.item_ingredients}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId='price'>
                    <Form.Label>Item Price</Form.Label>
                    <Form.Control
                      name='item_price'
                      type='text'
                      pattern='^[A-Za-z0-9 ]+$'
                      required={true}
                      onChange={this.onChange}
                      autocomplete='off'
                      value={this.state.item_price}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId='category'>
                    <Form.Label>Item Category</Form.Label>
                    <Form.Control
                      name='item_category'
                      type='text'
                      pattern='^[A-Za-z0-9 ]+$'
                      required={true}
                      onChange={this.onChange}
                      autocomplete='off'
                      value={this.state.item_category}
                    />
                  </Form.Group>
                </Form.Row>
                <ButtonGroup aria-label='Third group'>
                  <Button
                    type='submit'
                    variant='success'
                    style={{ background: '#d32323' }}
                    id='add'
                  >
                    Add/Update Item
                  </Button>
                </ButtonGroup>
                {'  '}
              </Form>
            </Col>
          </Row>
          <br />
        </Container>
      </div>
    );
  }
}

export default compose(
  graphql(addItemMutation, {
    name: 'addItemMutation',
  }),
  withApollo
)(AddItem);
