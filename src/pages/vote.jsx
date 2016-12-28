import React, { Component } from 'react';
import { observable } from "mobx";
import { observer } from "mobx-react";
import q from 'q'
import auth from '../services/auth'
import election from '../services/election'

import {Link} from 'react-router';
import Halogen from 'halogen';

import Ballot from '../components/ballot'

@observer
class VotePage extends Component {
  static fromHash(nextState, replace, callback) {
    console.log(nextState)
    const hash = nextState.params.hash

    auth.fromHash(hash).then(()=> {
      replace("/elections/7/vote")
      callback()
    }).catch(() => {
      replace("/elections/7/vote")
      callback()
    })
  }

  @observable state = {
    loading : true,
    election : null,
    candidates : [],
    ballot : null,
  }

  constructor(props) {
    super(props)

    const electionId = this.props.params.electionId
    const userId = 'asdf'

    q.all([
      election.getById(this.props.params.electionId),
      election.getBallot(electionId, userId),
    ]).spread((election, ballot)=>{
      console.log(election)
      this.state.election = election
      this.state.ballot = ballot
    }).finally(() => {
      this.state.loading = false
    }).done()
  }

  ballot = () => {
    if(this.state.loading) {
      return (
        <div className="has-text-centered">
        <Halogen.PulseLoader color={"gray"}/>
        </div>
      )
    }

    return (
      <div className="container">
        <div className="section has-text-centered">
          <h1 className="title is-1">
            {this.state.election.title}
          </h1>
          <h2 className="subtitle is-3">
            {this.state.election.subtitle}
          </h2>
        </div>

        <Ballot ballot={this.state.ballot} candidates={this.state.election.candidates}/>
      </div>
    )
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
            </nav>
            </div>
          </div>
        </header>
        <section className="section">
          {this.ballot()}
        </section>
      </div>
    );
  }
};

export default VotePage;