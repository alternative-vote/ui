import React, { Component } from 'react';
import { observable, action } from "mobx";
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
    election : null,
    ballot : null,
    isLoading : true,
    isConfirming : false,
  }

  constructor(props) {
    super(props)

    const electionId = this.props.params.electionId
    const userId = 'asdf'

    q.all([
      election.getById(this.props.params.electionId),
      election.getBallot(electionId, userId),
    ]).spread((election, ballot)=>{
      this.state.election = election
      this.state.ballot = ballot
    }).finally(() => {
      this.state.isLoading = false
    }).done()
  }

  @action
  startConfirmation = () => {
    this.state.isConfirming = true
  }

  @action
  cancelConfirmation = () => {
    this.state.isConfirming = false
  }

  isBallotDisabled = () => {
    return this.state.isConfirming || this.state.ballot.isSubmitted
  }

  ballot = () => {
    if(this.state.isLoading) {
      return (
        <div className="has-text-centered">
        <Halogen.PulseLoader color={"gray"}/>
        </div>
      )
    }

    return (
      <div className="container flex flex-col flex-auto">
        <div className="has-text-centered flex-none">
          <h1 className="title is-1">
            {this.state.election.title}
          </h1>
          <h2 className="subtitle is-3">
            {this.state.election.subtitle}
          </h2>
        </div>
        <hr className="flex-none"/>
        <div className="flex flex-auto">
          <Ballot ballot={this.state.ballot} candidates={this.state.election.candidates} disabled={this.isBallotDisabled()}/>
        </div>
      </div>
    )
  }

  footerButtons = () => {
    if (this.state.isConfirming) { 
      return (
        <div className="nav-right">
          <div className="nav-item">
            <button className="button" onClick={this.cancelConfirmation}>Cancel</button>
          </div>
          <div className="nav-item">
            <button className="button" onClick={this.startConfirmation}>Confirm</button>
          </div>
        </div>
      )
    } 

    return (
      <div className="nav-right">
        <div className="nav-item">
          <button className="button" onClick={this.startConfirmation}>Submit</button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="full-height flex flex-col">   
        <header className="hero is-primary flex-none">
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
        <section className="section flex flex-col flex-auto scroll main-content">
          {this.ballot()}
        </section>
        <footer className="hero is-primary flex-none">
          <div className="hero-head">
          <div className="container">
          <div className="nav">
            {this.footerButtons()}
          </div>
          </div>
          </div>
        </footer>
      </div>
    );
  }
};

export default VotePage;