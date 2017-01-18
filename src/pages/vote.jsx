import React, { Component } from 'react';
import { observable, action, autorun } from "mobx";
import { observer } from "mobx-react";
import q from 'q'
import auth from '../services/auth'
import election from '../services/election'

import {Link} from 'react-router';
import {Motion, spring, presets} from 'react-motion';
import Halogen from 'halogen';

import Ballot from '../components/ballot'

@observer
class VotePage extends Component {
  @observable state = {
    election : null,
    ballot : null,
    isLoading : true,
    isConfirming : false,
    is404 : false,
  }

  constructor(props) {
    super(props)

    const hash = this.props.params.hash
    const userId = 'asdf'

    const debouncedSave = _.debounce(this.saveBallot, 1000);

    election.getFromHash(hash).then(({election, ballot})=>{
      this.state.election = election
      this.state.ballot = ballot

      let first = true;
      autorun(() => {
        JSON.stringify(this.state.ballot.votes)
        if(first) {
          first = false;
        } else {
          debouncedSave();
        }
      });

      if(election.state == 'edit') {
        this.state.is404=true;
      }
    }).catch(() => {
      this.state.is404 = true;
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
    this.saveBallot();
  }

  @action
  unSubmit = () => {
    this.state.ballot.isSubmitted = false
    this.saveBallot();
  }

  saveBallot = () => {
    election.saveBallot(this.props.params.hash, this.state.ballot).done();
  }

  isBallotDisabled = () => {
    return this.state.isConfirming || this.state.ballot.isSubmitted || this.state.election.state != 'running'
  }

  getStatus = () => {
    const {state} = this.state.election
    
    //states: edit, running, complete

    if(state == 'edit') {
      
    }
    if(state == 'running') {
      return 'Active';
    }
    return 'Closed';
  }

  content = () => {
    if(this.state.isLoading) {
      return (
        <div className="has-text-centered" style={{margin : 'auto'}}>
        <Halogen.PulseLoader color={"gray"}/>
        </div>
      )
    }

    if(this.state.is404) {
      return (
        <div className="has-text-centered" style={{margin : 'auto'}}>
          <h1 className="title is-1">
            404
          </h1>
          <h2 className="subtitle is-3">
            There's nothing to vote on here.
          </h2>
        </div>
      )
    }

    return (
      <div className="container flex flex-col flex-auto">
        <div className="flex-none">
        <div className="level">
        <div className="level-item">
        <div>
        <h1 className="title is-1">
            {this.state.election.title}
        </h1>
        <h2 className="subtitle is-3">
          {this.state.election.subtitle}
        </h2>
        </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <p className="heading">{this.getStatus()}</p>
            {this.ballotIcon()}
            </div>
          </div>
        </div>
        </div>
        <hr className="flex-none"/>
        <div className="flex flex-auto flex-col">
          <Ballot ballot={this.state.ballot} candidates={this.state.election.candidates} disabled={this.isBallotDisabled()}/>
        </div>
        <div className="container">
          <div className="flex-none">
            {this.footerButtons()}
        </div>
        </div>
      </div>
    )
  }

  ballotIcon = () => {
    const {isSubmitted} = this.state.ballot;

    const springs = {
      scale : spring(isSubmitted ? 1.05 : 0.7, presets.wobbly),
      green : spring(isSubmitted ? 128 : 100),
    }

    return (
      <Motion style={springs}>
      {interpolatedStyle => {
        const {scale, green} = interpolatedStyle

        const ballotStyle = {
          opacity : isSubmitted ? 0 : 1,
          color : 'OrangeRed',
        }

        const receivedStyle = {
          position : 'absolute',
          top : 0,
          left : 0,
          opacity : isSubmitted ? 1 : 0,
          marginRight: Math.round(green),
          color : `rgb(0,${Math.round(green)},0)`,
          transform: `scale(${scale})`,
        }

        return (
          <div style={{position: 'relative'}}>
            <div className="icon is-large" style={ballotStyle}>
              <i className="icon-ballot" ></i>
            </div>
            <div className="icon is-large" style={receivedStyle}>
              <i className="icon-ballot-received"></i>
            </div>
          </div>
        )
      }}
      </Motion>
    )
  }

  flipButtons = () => {
    if((this.state.ballot || {}).isSubmitted || this.state.election.state == 'completed') {
      return {
        rotation: spring(2),
      }
    }
    if(this.state.isConfirming) {
      return {
        rotation: spring(1),
      }
    }
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
                <button className="button" onClick={this.unSubmit}>Unsubmit</button>
              </div>
            </div>
          )
        }

        return (
          <div className="nav" style={{margin: '10px 0px'}}>
            {dom}
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
          {this.content()}
        </section>
      </div>
    );
  }
};

export default VotePage;