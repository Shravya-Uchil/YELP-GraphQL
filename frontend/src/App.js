import React, { Component } from 'react';
import './App.css';
import Main from './components/Main';
import { BrowserRouter } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import serverAddress from './config';
// apollo client setup
const client = new ApolloClient({
  uri: `${serverAddress}/graphiql`,
});

//App Component
function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </div>
    </ApolloProvider>
  );
}
//Export the App component so that it can be used in index.js
export default App;
