import React, { Component } from 'react';
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import q from 'q'
import auth from '../services/auth'
import election from '../services/election'

import {Link} from 'react-router';
import {Motion, spring} from 'react-motion';
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

    const hash = this.props.params.hash
    const userId = 'asdf'

    election.getFromHash(hash).then(({election, ballot})=>{
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
  
  @action
  submit = () => {
    this.state.ballot.isSubmitted = true
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

  flipButtons = () => {
    if((this.state.ballot || {}).isSubmitted) {
      console.log('spring to 2')
      return {
        rotation: spring(2),
      }
    }
    if(this.state.isConfirming) {
      console.log('spring to 1')
      return {
        rotation: spring(1),
      }
    }
    console.log('spring to 0')
    return {
      rotation: spring(0),
    }
  }

  footerButtons = () => {
    return (
    <Motion style={this.flipButtons()}>
      {interpolatedStyle => {
        const {rotation} = interpolatedStyle;

        //-0.5 -> 0 -> 0.5 90 - Math.abs()
        const deg = 90 - (Math.abs((rotation % 1) - 0.5) * 180)

        const style = {
          transform : `rotateX(${deg}deg)`
        }
        
        let dom = (
          <div className="nav-right">
            <div className="nav-item">
              <button className="button is-primary" onClick={this.startConfirmation} style={style}>Submit</button>
            </div>
          </div>
        )
        if(rotation > 0.5) {
          dom = (
            <div className="nav-right">
              <div className="nav-item">
                <button className="button" onClick={this.cancelConfirmation} style={style}>Cancel</button>
              </div>
              <div className="nav-item">
                <button className="button is-primary" onClick={this.submit} style={style}>Confirm</button>
              </div>
            </div>
          )
        }
        if(rotation > 1.5) {
          style.opacity=0;
          
          dom = (
            <div className="nav-right">
              <div className="nav-item">
                <button className="button" style={style}>Placeholder for sizing</button>
              </div>
            </div>
          )
        }

        return (
          <div className="level">
            <div className="level-item">
            <div className="notification">
            </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                {dom}
              </div>
            </div>
          </div>
        );
      }}
      </Motion>
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
                  <h1 className="title">electioneer.io</h1>
                </Link> 
              </div>
            </nav>
            </div>
          </div>
        </header>
        <section className="section flex flex-col flex-auto scroll main-content">
          {this.ballot()}
          <div className="container">
          <div className="card-content flex-none">
            {this.footerButtons()}
          </div>
          </div>
        </section>
        
      </div>
    );
  }
};

export default VotePage;