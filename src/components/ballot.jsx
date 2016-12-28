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

@DragDropContext(HTML5Backend)
@observer
class Ballot extends Component {
    static propTypes = {
        ballot : React.PropTypes.instanceOf(BallotModel).isRequired,
        candidates : React.PropTypes.any.isRequired,
    }

    // getData = () => {
    //     return this.props.candidates
    // }

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

    render() {
        return (
            <div className="columns">
                <div className="column is-one-third">
                    <div className="card z-2 is-fullwidth">
                        <div className="card-content">
                            <h1 className="title has-text-centered">Candidates</h1>
                            <CandidateList ballot={this.props.ballot} candidates={this.props.candidates}/>
                        </div>
                    </div>
                </div>
                <div className="column">
                    <div className="card z-2 is-fullwidth">
                        <div className="card-content">
                            <h1 className="title has-text-centered">My Ballot</h1>
                            <VotesList ballot={this.props.ballot} candidates={this.props.candidates}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Ballot