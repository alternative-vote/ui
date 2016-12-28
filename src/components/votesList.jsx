import React, { Component } from 'react';
import { action } from "mobx";
import { observer } from "mobx-react";
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';

import {Ballot as BallotModel} from '../models/ballot'

import CandidateCard from './candidateCard'

const target = {
    @action
    hover(props, monitor) {
        const id = monitor.getItem().candidateId
        const votes = props.ballot.votes
        const candidates = props.candidates
        const index = _.findIndex(votes, { id })

        if (index < 0) {
            console.log('adding', id)
            const candidate = _.find(candidates, { id })
            votes.push(candidate)
        }
    }
};

function collector(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

@DropTarget('candidate', target, collector)
@observer
export default class VotesList extends Component {
    static propTypes = {
        disabled : React.PropTypes.bool, 
        ballot : React.PropTypes.instanceOf(BallotModel).isRequired,
        candidates : React.PropTypes.any.isRequired,
    }

    getUnusedCandidates = () => {
        //todo: random ordering
        return _.difference(this.props.candidates, this.props.ballot.votes)
    }

    @action
    reorder = (id, targetIndex) => {
        const votes = this.props.ballot.votes
        const candidates = this.props.candidates
        const currentIndex = _.findIndex(votes, { id })
        const candidate = _.find(candidates, { id })
        
        if(currentIndex >= 0) {
            votes.splice(currentIndex, 1)
        }
        votes.splice(targetIndex, 0, candidate)
    }

    placeholder = () => {
        if(this.props.disabled) {
            return ''
        }
        if(this.props.ballot.votes.length == this.props.candidates.length) {
            return ''
        }

        const length = this.props.ballot.votes.length + 1
        const style = {
            borderBottom : '1px solid black'
        }

        return (
            <div className="columns">
                <div className="column is-2">
                    <h1 className="title">{length}</h1>
                </div>
                <div className="column" style={{...style}}>
                    
                </div>
            </div>
        )
    }

    render() {
        const { connectDropTarget, isOver } = this.props;
        //TODO: SOME HOVER EFFECT
        const ui = (
            <div className="">
                <div className="columns">
                    <div className="column is-8 is-offset-2">
                        {this.props.ballot.votes.map((candidate, i) => (
                            <div className="columns" key={candidate.id}>
                                <div className="column is-2">
                                    <h1 className="title">{i+1}</h1>
                                </div>
                                <div className="column">
                                    <CandidateCard key={candidate.id} index={i} candidate={candidate} moveCandidate={this.reorder} disabled={this.props.disabled}/>
                                </div>
                            </div>
                        ))}
                        {this.placeholder()}
                    </div>
                </div>
            </div>
        )

        if (this.props.disabled) {
            return ui
        }

        return connectDropTarget(ui)
    }
}