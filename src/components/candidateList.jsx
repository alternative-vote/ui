import React, { Component } from 'react';
import { autorun, action, observable, toJS } from "mobx";
import { observer } from "mobx-react";
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';

import {Ballot as BallotModel} from '../models/ballot'

import {DraggableCandidateCard} from './candidateCard'
import AnimatedList from './animatedList'

const target = {
    @action
    hover(props, monitor) {
        const id = monitor.getItem().candidateId
        const votes = props.ballot.votes
        const candidates = props.candidates
        const index = _.findIndex(votes, {title : monitor.getItem().candidateId})

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

function includes(str, substring) {
    return str.toLowerCase().includes(substring.toLowerCase())
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

    @observable
    filter = '';

    constructor(props) {
        super(props);

        autorun(() => {
            this.candidates = toJS(_.differenceBy(this.props.candidates, this.props.ballot.votes, (c) => {
                return c.title;
            }))
        })
    }

    setFilter = (e) => {
        this.filter = e.target.value;
    }

    filteredCandidates = () => {
        return this.candidates.filter((candidate) => {
           return includes(candidate.title, this.filter) ||
           includes(candidate.subtitle, this.filter) ||
           includes(candidate.description, this.filter);
        });
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
            <div style={this.props.style} className={"card z-2 is-fullwidth flex flex-col candidate-list " + (isOver ? 'over' : '')}>
                <div className="card-content flex-none">
                    <div>
                        <h1 className="title has-text-centered">Candidates</h1>
                        <div className="control">
                            <input type="text" className="input" placeholder="search..." onChange={this.setFilter} disabled={this.candidates.length == 0 }/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-auto">
                <div className="scroll-fade-top"></div>
                <div className="card-content flex-auto scroll">
                    <div style={{position: 'relative'}}>
                    {this.emptyMessage()}
                    <AnimatedList>
                        {this.filteredCandidates().map((candidate, i) => (
                            <DraggableCandidateCard key={candidate.title} className="card z-1 is-fullwidth" candidate={candidate} details draggable/>
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