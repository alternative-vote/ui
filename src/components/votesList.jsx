import React, { Component } from 'react';
import { action } from "mobx";
import { observer } from "mobx-react";
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import {Motion, spring} from 'react-motion';
import _ from 'lodash';

import {Ballot as BallotModel} from '../models/ballot'

import {DraggableCandidateCard} from './candidateCard'
import AnimatedList from './animatedList'


const target = {
    hover(props, monitor) {
        const title = monitor.getItem().candidateId
        const votes = props.ballot.votes
        const candidates = props.candidates
        const index = _.findIndex(votes, { title })

        if (index < 0) {
            const candidate = _.find(candidates, { title })
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
    reorder = (draggingId, targetId) => {
        const votes = this.props.ballot.votes
        const candidates = this.props.candidates
        const currentIndex = _.findIndex(votes, { title : draggingId })
        const targetIndex = _.findIndex(votes, { title : targetId })
        const candidate = _.find(candidates, { title : draggingId })
        
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

    getItems() {
        const items = []

        this.props.ballot.votes.forEach((candidate, i) => {
            items.push(
                <DraggableCandidateCard key={candidate.title} className={"is-fullwidth" + (this.props.disabled ? "" : " card z-1")}
                    style={{transition : 'all 250ms ease-out'}}
                    candidate={candidate} 
                    onHover={this.reorder} 
                    draggable={!this.props.disabled} 
                    droppable={!this.props.disabled}/>
            );
        });

        //If ballot is enabled and full
        if(!this.props.disabled && this.props.ballot.votes.length != this.props.candidates.length) {
            items.push(
                <div key="_placeholder" className="placeholder"></div>
            )
        }

        return items;
    }

    render() {
        const { connectDropTarget, isOver } = this.props;
        const items = this.getItems();

        const ui = (
            <div className={"card z-2 is-fullwidth flex flex-col candidate-list " + (isOver ? 'over' : '')}>
                <div className="card-content flex-none">
                    <div>
                        <h1 className="title has-text-centered">My Ballot</h1>
                    </div>
                </div>
                <div className="flex flex-auto">
                    <div className="scroll-fade-top"></div>
                    <div className="card-content flex-auto scroll">
                        <div className="columns" style={{position: 'relative'}}>
                            {(this.props.disabled && items.length == 0) ? (
                                <div className="has-text-centered">
                                    <small>This ballot is empty.</small>
                                </div>
                            ) : null}
                            <div className="column is-1 is-offset-1">
                                <div style={{position:'relative'}}>
                                <AnimatedList fixedHeight={71} animateEnterLeave >
                                    {items.map((vote, i) => 
                                        <div key={i} className="flex has-text-centered" style={{height: '59px', alignItems: 'center'}}>
                                            <h1  className="title" style={{margin : 'auto'}}>{i+1}</h1>
                                        </div>
                                    )}
                                </AnimatedList>
                                </div>
                            </div>
                            <div className="column is-9">
                                <div style={{position:'relative'}}>
                                <AnimatedList fixedHeight={71} >
                                    {items}
                                </AnimatedList>
                                </div>
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