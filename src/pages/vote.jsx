import React, { Component } from 'react';
import { observable, action, autorun } from "mobx";
import { observer } from "mobx-react";
import q from 'q'

import auth from '../services/auth'
import election from '../services/election'

import state from '../services/globalState'

import {Link} from 'react-router';
import {Motion, spring, presets} from 'react-motion';
import Halogen from 'halogen';

import Ballot from '../components/ballot'
import VotesList from '../components/votesList'
import Results from '../components/results'
import Help from '../components/help'


@observer
class VotePage extends Component {
  @observable data = {
    election : null,
    ballot : null,
    isLoading : true,
    isConfirming : false,
    is404 : false,
  }

  @observable
  is404 = true;

  constructor(props) {
    super(props)

    const hash = this.props.params.hash
    const userId = 'asdf'

    const debouncedSave = _.debounce(this.saveBallot, 1000);

    election.getFromHash(hash).then(({election, ballot})=>{
      this.data.election = election
      this.data.ballot = ballot

      let first = true;
      autorun(() => {
        JSON.stringify(this.data.ballot.votes)
        if(first) {
          first = false;
        } else {
          debouncedSave();
        }
      });

      if(election.data == 'edit') {
        this.data.is404=true;
      }
    }).catch(() => {
      this.data.is404 = true;
    }).finally(() => {
      this.data.isLoading = false
    }).done()

  }

  startConfirmation = () => {
    this.data.isConfirming = true
  }

  cancelConfirmation = () => {
    this.data.isConfirming = false
  }
  
  submit = () => {
    this.data.ballot.isSubmitted = true
    this.saveBallot();
  }

  showHelp = () => {
    state.showHelp = true;
  }

  closeHelp = () => {
    state.showHelp = false;
  }

  unSubmit = () => {
    this.data.ballot.isSubmitted = false
    this.saveBallot();
  }

  saveBallot = () => {
    election.saveBallot(this.props.params.hash, this.data.ballot).done();
  }

  isBallotDisabled = () => {
    return this.data.isConfirming || this.data.ballot.isSubmitted || this.data.election.state != 'running'
  }

  getStatus = () => {
    const {state} = this.data.election
    
    if(state == 'edit') {
      return 'Inactive'
    }
    if(state == 'running') {
      return 'Active';
    }
    return 'Closed';
  }

  content = () => {
    if(this.data.isLoading) {
      return (
        <div className="has-text-centered" style={{margin : 'auto'}}>
        <Halogen.PulseLoader color={"gray"}/>
        </div>
      )
    }

    if(this.data.is404) {
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

    let body;
    if(this.data.election.state == 'complete') {
      body = (
        <div>
          <Results results={this.data.election.results}/>
          <br/>
        </div>
      )
    } else {
      body = <Ballot ballot={this.data.ballot} candidates={this.data.election.candidates} disabled={this.isBallotDisabled()}/>
    }

    return (
      <div className="container flex flex-col flex-auto">
        <div className="flex-none">
        <div className="level">
        <div className="level-item">
        <div>
        <h1 className="title is-1">
            {this.data.election.title}
        </h1>
        <h2 className="subtitle is-3">
          {this.data.election.subtitle}
        </h2>
        </div>
        </div>
        <div className="level-right">
          <div className="level-item tooltip-wrapper" style={{position : 'relative'}}>
            <p className="heading">{this.getStatus()}</p>
            {this.ballotIcon()}
            <div className="tooltip z-3">
              <div className="message">
                <div className="message-header">
                  {this.getTooltipText().header}
                </div>
                <div className="message-body">
                  {this.getTooltipText().body}
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
        </div>
        <hr className="flex-none"/>
        <div className="flex flex-auto flex-col" style={{minHeight: '300px'}}>
          {body}
        </div>
        {this.footerButtons()}
      </div>
    )
  }

  getTooltipText = () => {
    let header = '';
    let body = '';

    if (this.data.ballot.isSubmitted) {
      header = 'You voted!';
      if (this.data.election.state == 'running') {
        body = 'Your vote was succesfully submitted. You will receive an email with results when the election ends.';
      } else {
        body = 'Your vote was succesfully submitted. Check out the results.';
      }
    } else {
      if (this.data.election.state == 'running') {
        header = 'You have not voted.'
        body = 'Your vote will not count until it is submitted and confirmed.'
      } else {
        header = 'You did not vote.'
        body = 'This election is closed; you missed your opportunity. Sorry!'
      }
    }

    return {header, body}
  }

  ballotIcon = () => {
    const {isSubmitted} = this.data.ballot;

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
        }

        const receivedStyle = {
          position : 'absolute',
          top : 0,
          left : 0,
          opacity : isSubmitted ? 1 : 0,
          marginRight: Math.round(green),
          transform: `scale(${scale})`,
        }

        return (
          <div style={{position: 'relative'}}>
            <div className="icon is-large is-danger" style={ballotStyle}>
              <i className="icon-ballot" ></i>
            </div>
            <div className="icon is-large is-success" style={receivedStyle}>
              <i className="icon-ballot-received"></i>
            </div>
          </div>
        )
      }}
      </Motion>
    )
  }

  flipButtons = () => {
    if((this.data.ballot || {}).isSubmitted || this.data.election.state == 'complete') {
      return {
        rotation: spring(2),
      }
    }
    if(this.data.isConfirming) {
      return {
        rotation: spring(1),
      }
    }
    return {
      rotation: spring(0),
    }
  }

  footerButtons = () => {
    if(this.data.election.state == 'complete') {
      return null;
    }

    const disabled = this.data.ballot.votes.length == 0;

    return (
    <div className="flex-none">
    <div className="container">
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
              <button className="button is-primary" 
                onClick={this.startConfirmation} 
                style={style} disabled={disabled}>Submit</button>
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
          dom = (
            <div className="nav-right">
              <div className="nav-item">
                <button className="button" style={{opacity:0}} disabled>Unsubmit</button>
                <span style={style}>You're done!</span>
              </div>
            </div>
          )
        }

        return (
          <div className="level" style={{margin: '10px 0px'}}>
            <div className="level-left">
              <div className="level-item">
              </div>
            </div>
            {dom}
          </div>
        );
      }}
      </Motion>
      </div>
      </div>
    )
  }

  render() {
    return (
      <div className="full-height flex flex-col">   
        <Help disabled={!state.showHelp} onClose={this.closeHelp}></Help>
        <header className="hero is-primary flex-none">
          <div className="header-stripe"></div>
          <div className="hero-head">
            <div className="container">
            <nav className="nav">
              <div className="nav-left">
                <div className="nav-item">
                  <h1 className="title">electioneer</h1>
                </div>
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