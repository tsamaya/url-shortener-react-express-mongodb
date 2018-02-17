import 'whatwg-fetch';
import React from 'react';

import logo from './logo.svg';
import InputURLForm from './InputURLForm';

import './App.css';

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">URL Shortener</h1>
    </header>
    <p className="App-intro">Yet another URL shortener</p>
    <InputURLForm />
  </div>
);

export default App;
