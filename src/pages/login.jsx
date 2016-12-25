import React, { Component } from 'react';
import { observer } from "mobx-react";
import { observable } from "mobx";
import { withRouter } from 'react-router';
import auth from '../services/auth';

class LoginModel {
  @observable username = ''; 
  @observable password = '';
  @observable errorMessage = '';
}

@observer
class LoginPage extends Component {
  state = new LoginModel()

  login = (e) => {
    e.preventDefault();

    auth.login(this.state.username, this.state.password).then(() => {
      this.props.router.push('/')
    }).catch((errorMessage) => {
      this.state.errorMessage = (
        <div className="notification is-danger">
          {errorMessage}
        </div>
      )
    })
  }

  create = (e) => {
    e.preventDefault()

    auth.create(this.state.username, this.state.password).then(() => {
      return this.login(e)
    }).catch((errorMessage) => {
      this.state.errorMessage = (
        <div className="notification is-danger">
          {errorMessage}
        </div>
      )
    })
  }

  setUsername = (event) => {
    this.state.username = event.target.value
  }

  setPassword = (event) => {
    this.state.password = event.target.value
  }

  render() {
    return (
      <section className="section full-height">
        <div className="container">
          <h1 className="title is-1 has-text-centered">Votr</h1>
          <div className="columns">
            <div className="column is-6 is-offset-3">
              <div className="box ">
                <form onSubmit={this.login}>
                  {this.state.errorMessage}
                  <div className="control">
                    <input type="text" className="input" placeholder="email" name="username" value={this.state.username} onChange={this.setUsername} />
                  </div>
                  <div className="control">
                    <input type="password" className="input" placeholder="password" name="password" value={this.state.password} onChange={this.setPassword} />
                  </div>
                  <div className="control level">
                    <span className="level-item">
                      <a onClick={this.create}>create account</a>
                    </span>
                    <span className="level-item"></span>
                    <button className="level-item button is-primary">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
};

class Car {
  make = '';
  model = '';
  age = 0;
}

new Car()


export default LoginPage;