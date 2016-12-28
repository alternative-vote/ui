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
        const index = _.findIndex(votes, {id : monitor.getItem().candidateId})

        if (index >= 0) {
            console.log('removing', id)
            votes.splice(index, 1)
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
export default class CandidateList extends Component {
    static propTypes = {
        ballot : React.PropTypes.instanceOf(BallotModel).isRequired,
        candidates : React.PropTypes.any.isRequired,
    }

    getUnusedCandidates = () => {
        //todo: random ordering
        return _.difference(this.props.candidates, this.props.ballot.votes)
    }

    noop = () => {}

    render() {
        const { connectDropTarget, isOver } = this.props;
        //TODO: SOME HOVER EFFECT
        return connectDropTarget(
            <div className="">
                {this.getUnusedCandidates().map((candidate, i) => (
                    <CandidateCard key={candidate.id} index={i} candidate={candidate} moveCandidate={this.noop}/>
                ))}
            </div>
        )
    }
}