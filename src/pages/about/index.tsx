import React, { Component } from 'react';
import logo from '../../images/logo_horizontal.svg';
import gif from '../../images/nacho.gif';
import './style.css';

class AboutPage extends Component {
  render() {
		return ( 
      <div>
        <img src={logo} className="logo" />
        <h2> About </h2>
        <img src={gif} className="gif" />
        <p>
          {'Create with <3 by Shy.'}
        </p>
      </div>
    )
  }
}

export default AboutPage;
