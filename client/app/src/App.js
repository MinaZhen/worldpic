import React, { Component } from 'react';
import Header from './components/Header';
import Main from './components/Main'
import Footer from './components/Footer';
import { withRouter } from 'react-router-dom'

import './styles/main.css';
import './styles/specific.css';

class App extends Component {

  state = {
    url: '',
    token: '',
    username: '',
    password: '',
    id: ''
  }

  render() {
    return (
      <div className="App">
        <Header/>
        <Main/>
        <Footer />

      </div>
    );
  }
}

export default withRouter(App);
