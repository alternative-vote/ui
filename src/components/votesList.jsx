import React, { Component } from 'react';
import { action } from "mobx";
import { observer } from "mobx-react";
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';

import {Ballot as BallotModel} from '../models/ballot'

import AnimatedList from './animatedList'
import CandidateCard from './candidateCard'

const target = {
    @action
    hover(props, monitor) {
        const id = monitor.getItem().candidateId
        const votes = props.ballot.votes
        const candidates = props.candidates
        const index = _.findIndex(votes, { id })

        if (index < 0) {
            const candidate = _.find(candidates, { id })
            votes.push(candidate)
            monitor.getItem().index = votes.length
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

        return targetIndex
    }

    placeholder = () => {
        if(this.props.disabled) {
            if (this.props.ballot.votes.length == 0) {
                return (
                    <div className="has-text-centered">
                    <small>This ballot is empty.</small>
                    </div>
                )
            } else {
                return ''
            }
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

    renderPlaceholder(i, key, content) {
        return (
            <div className="level columns" key={key}>
                <div className="level-left column is-1">
                    <div className="level-item">
                        <h1 className="title">{i+1}</h1>
                    </div>
                </div>
                <div className="level-item column">
                    {content}
                </div>
            </div>
        )
    }

    getVotes() {
        const votes = []
        this.props.ballot.votes.forEach((candidate, i) => {
            votes.push(this.renderPlaceholder(
                i, 
                candidate.id, 
                <CandidateCard index={i} candidate={candidate} moveCandidate={this.reorder} disabled={this.props.disabled} enableDrop/>
            ));
        });

        //If ballot is disabled and empty
        if(this.props.disabled && this.props.ballot.votes.length == 0) {
            votes.push((
                <div className="has-text-centered">
                    <small>This ballot is empty.</small>
                </div>
            ))
        }

        //If ballot is enabled and full
        if(!this.props.disabled && this.props.ballot.votes.length != this.props.candidates.length) {
            votes.push(this.renderPlaceholder(
                this.props.ballot.votes.length,
                '_placeholder',
                <div className="placeholder"></div>
            ))
        }

        if(votes.length == 0) {
            return null;
        }

        return votes;
    }

    render() {
        const { connectDropTarget, isOver } = this.props;
        //TODO: SOME HOVER EFFECT
        const ui = (
            <div className="card z-2 is-fullwidth flex flex-col">
                <div className="card-content flex-none">
                    <div>
                        <h1 className="title has-text-centered">My Ballot</h1>
                    </div>
                </div>
                <div className="flex flex-auto">
                    <div className="scroll-fade-top"></div>
                    <div className="card-content flex-auto scroll">
                        <div className="columns">
                            <div className="column is-8 is-offset-2" style={{position: 'relative'}}>
                                <AnimatedList>
                                    {this.getVotes()}
                                </AnimatedList>
                            </div>
                        </div>
                    </div>
                    <div className="scroll-fade-bottom"></div>
                </div>
            </div>
        )

        if (this.props.disabled) {
            return ui
        }

        return connectDropTarget(ui)
    }
}