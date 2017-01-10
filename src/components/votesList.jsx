import React, { Component } from 'react';
import { action, observable, toJS } from "mobx";
import { observer } from "mobx-react";
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import {Motion, spring} from 'react-motion';
import _ from 'lodash';

import {Ballot as BallotModel} from '../models/ballot'

import {DraggableCandidateCard} from './candidateCard'
import AnimatedList from './animatedList'


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
    reorder = (draggingId, targetId) => {
        const votes = this.props.ballot.votes
        const candidates = this.props.candidates
        const currentIndex = _.findIndex(votes, { id : draggingId })
        const targetIndex = _.findIndex(votes, { id : targetId })
        const candidate = _.find(candidates, { id : draggingId })
        
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

    // renderPlaceholder(i, key, content) {
    //     return (
    //         <div className="level columns" key={key}>
    //             <div className="level-left column is-1">
    //                 <div className="level-item">
    //                     <h1 className="title">{i+1}</h1>
    //                 </div>
    //             </div>
    //             <div className="level-item column">
    //                 {content}
    //             </div>
    //         </div>
    //     )
    // }

    getItems() {
        const items = []

        this.props.ballot.votes.forEach((candidate, i) => {
            items.push(
                <DraggableCandidateCard key={candidate.id} className={"is-fullwidth" + (this.props.disabled ? "" : " card z-1")}
                    style={{transition : 'all 250ms ease-out'}}
                    candidate={candidate} 
                    onHover={this.reorder} 
                    draggable={!this.props.disabled} 
                    droppable={!this.props.disabled}/>
            );
        });

        //If ballot is disabled and empty
        // if(this.props.disabled && this.props.ballot.votes.length == 0) {
        //     items.push(
        //         <div key="_emptyMessage" className="has-text-centered">
        //             <small>This ballot is empty.</small>
        //         </div>
        //     )
        // }

        //If ballot is enabled and full
        if(!this.props.disabled && this.props.ballot.votes.length != this.props.candidates.length) {
            items.push(
                <div key="_placeholder" className="placeholder"></div>
            )
        }

        // if(items.length == 0) {
        //     return null;
        // }

        return items;
    }

    @observable
    yPositions = []

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
                        <div className="columns">
                            <div className="column is-8 is-offset-2" style={{position: 'relative'}}>
                                {(this.props.disabled && items.length == 0) ? (
                                        <div className="has-text-centered">
                                            <small>This ballot is empty.</small>
                                        </div>
                                ) : null}
                                <div className="columns">
                                    <div className="column is-1">
                                        <AnimatedList fixedHeight={95} animateEnterLeave >
                                            {items.map((vote, i) => 
                                                <div key={i} className="flex" style={{height: '75px', alignItems: 'center'}}>
                                                    <h1  className="title">{i+1}</h1>
                                                </div>
                                            )}
                                        </AnimatedList>
                                    </div>
                                    <div className="column">
                                         <AnimatedList fixedHeight={95} >
                                            {items}
                                        </AnimatedList>
                                    </div>
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