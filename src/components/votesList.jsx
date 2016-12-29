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

    renderCandidate = (candidate, i) => {
        let card = ''
        let key = ''
        if (candidate == null) {
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

            i = this.props.ballot.votes.length
            card = (
                <div className="placeholder"></div>
            )
        } else {
            card = (
                <CandidateCard key={candidate.id} index={i} candidate={candidate} moveCandidate={this.reorder} disabled={this.props.disabled} enableDrop/>
            )
            key = candidate.id
        }

        return (
            <div className="level columns" key={key}>
                <div className="level-left column is-1">
                    <div className="level-item">
                        <h1 className="title">{i+1}</h1>
                    </div>
                </div>
                <div className="level-item column">
                    {card}
                </div>
            </div>
        )
    }

    render() {
        const { connectDropTarget, isOver } = this.props;
        //TODO: SOME HOVER EFFECT
        const ui = (
            <div className="card z-2 is-fullwidth">
                <div className="card-content">
                    <h1 className="title has-text-centered">My Ballot</h1>
                    <div className="columns">
                        <div className="column is-8 is-offset-2">
                            {this.props.ballot.votes.map(this.renderCandidate)}
                            {this.renderCandidate()}
                        </div>
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