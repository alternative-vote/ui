import React, { Component } from 'react';
import {Link} from 'react-router';
import { observable } from "mobx";
import { observer } from "mobx-react";

import auth from '../services/auth'
import election from '../services/election'

import Halogen from 'halogen'

@observer
class HomePage extends Component {
  @observable state = {
    loading : true,
    errorMessage : '',
    elections : []
  }

  constructor(props) {
    super(props)

    election.getMine().then((elections) => {
      this.state.elections = elections
    }).catch((errorMessage) => {
      this.state.errorMessage = errorMessage
    }).finally(() => {
      this.state.loading = false
    }) 
  }

  spinner = () => {
    if (this.state.loading) {
      return (
        <div className="has-text-centered">
        <Halogen.PulseLoader color={"gray"}/>
        </div>
      )
    }

    return ''
  }

  error = () => {
    if (this.state.errorMessage != '') {
      return (
        <div className="notification is-danger">
            {this.state.errorMessage}
          </div>
      )
    }

    return '';
  }

  electionList = () => {
    if (this.state.elections.length == 0) {
      return ''
    }
    return (
      <div>
          {this.state.elections.map((election) => {
            return (
              <div key={election.id}>{election.title}</div>
            )
          })}
      </div>
    )
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <div className="level">
            <div className="level-left">
              <h1 className="title level-item">
                My Elections
              </h1>
            </div>
            <div className="level-right">
              <span className="level-item">
                <input className="input" type="text" placeholder="search"/>
              </span>
              <Link to="/elections/new/admin" className="button is-primary level-item">+</Link>
            </div>
          </div>
          
          {this.spinner()}
          {this.error()}
          {this.electionList()}
        </div>
      </section>
    );
  }
};

export default HomePage;