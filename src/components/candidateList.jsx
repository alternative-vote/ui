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

    emptyMessage = () => {
        if (this.getUnusedCandidates().length > 0) {
            return ''
        }

        return (
            <div className="has-text-centered">
            <small>No candidates remaining.</small>
            </div>
        )
    }

    noop = () => {}

    render() {
        const { connectDropTarget, isOver } = this.props;
        //TODO: SOME HOVER EFFECT
        return connectDropTarget(
            <div className="card z-2 is-fullwidth flex flex-col">
                <div className="card-content flex-none">
                    <div>
                        <h1 className="title has-text-centered">Candidates</h1>
                    </div>
                </div>
                <div className="flex flex-auto">
                <div className="scroll-fade-top"></div>
                <div className="card-content flex-auto scroll">
                    {this.emptyMessage()}
                    {this.getUnusedCandidates().map((candidate, i) => (
                        <div className="columns" key={candidate.id} >
                        <div className="column">
                            <CandidateCard index={i} candidate={candidate} details disabledDrop/>
                        </div>
                        </div>
                    ))}
                </div>
                <div className="scroll-fade-bottom"></div>
                </div>
            </div>
        )
    }
}