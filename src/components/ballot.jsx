import React, { Component } from 'react';
import mobx, { observable, action } from "mobx";
import { observer, inject } from "mobx-react";

import {Ballot as BallotModel} from '../models/ballot'
import {Candidate} from '../models/election'
import _  from 'lodash'

import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

// import cardCard from './cardCard'
import CandidateCard from './candidateCard'
import CandidateList from './candidateList'
import VotesList from './votesList'

const card_TYPE = 'card'

//TODO: switch html5 / touch backends
@DragDropContext(HTML5Backend)
@observer
class Ballot extends Component {
    static propTypes = {
        disabled : React.PropTypes.bool,
        ballot : React.PropTypes.instanceOf(BallotModel).isRequired,
        candidates : React.PropTypes.any.isRequired,
    }

    getUnusedCandidates = () => {
        return _.difference(this.props.candidates, this.props.ballot.votes)
    }

    @action
    moveCandidate = (cardId, targetIndex) => {
        const candidates = this.props.candidates
        const currentIndex = _.findIndex(candidates, {id : cardId})
        const card = candidates[currentIndex]
        candidates.splice(currentIndex, 1)
        candidates.splice(targetIndex, 0, card)

        return targetIndex
    }

    candidateList = () => {
        if (this.props.disabled) {
            return ''
        }  
        
        return (
            <div className="column is-one-third">
                <CandidateList ballot={this.props.ballot} candidates={this.props.candidates} disabled={this.props.disabled}/>
            </div>
        )
    }

    render() {
        return (
            <div className="columns">
                {this.candidateList()}
                <div className="column">
                    <VotesList ballot={this.props.ballot} candidates={this.props.candidates} disabled={this.props.disabled}/>
                </div>
            </div>
        )
    }
}

export default Ballot