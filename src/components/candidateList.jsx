import React, { Component } from 'react';
import { autorun, action, observable, toJS } from "mobx";
import { observer } from "mobx-react";
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';

import {Ballot as BallotModel} from '../models/ballot'

import CandidateCard from './candidateCard'
import AnimatedList from './animatedList'

const target = {
    @action
    hover(props, monitor) {
        const id = monitor.getItem().candidateId
        const votes = props.ballot.votes
        const candidates = props.candidates
        const index = _.findIndex(votes, {id : monitor.getItem().candidateId})

        if (index >= 0) {
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

    @observable
    candidates = []

    constructor(props) {
        super(props);

        autorun(() => {
            this.candidates = toJS(_.difference(this.props.candidates, this.props.ballot.votes))
        })
    }

    emptyMessage = () => {
        if (this.candidates.length > 0) {
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
                    <div style={{position: 'relative'}}>
                    {this.emptyMessage()}
                    <AnimatedList>
                        {this.candidates.map((candidate, i) => (
                            <CandidateCard key={candidate.id} index={i} candidate={candidate} details disabledDrop/>
                        ))}
                    </AnimatedList>
                    </div>
                </div>
                <div className="scroll-fade-bottom"></div>
                </div>
            </div>
        )
    }
}