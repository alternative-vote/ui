import React, { Component } from 'react';
import {Link} from 'react-router';
import auth from '../services/auth'

class Layout extends Component {
  logout = () => {
    auth.logout()
    this.props.router.push('/login')
  }

  render() {
    return (
      <div className="full-height"> 
        <header className="hero is-primary">
          <div className="hero-head">
            <div className="container">
            <nav className="nav">
              <div className="nav-left">
                <Link className="nav-item" to="/">
                  <h1 className="title">Votr</h1>
                </Link> 
              </div>
              <div className="nav-right">
                <a className="nav-item" onClick={this.logout}>logout</a>
              </div>
            </nav>
            </div>
          </div>
        </header>
        {this.props.children}
      </div>
    );
  }
};

export default Layout;