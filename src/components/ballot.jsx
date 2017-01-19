import React, { Component } from 'react';
import mobx, { observable, action } from "mobx";
import { observer, inject } from "mobx-react";

import {Ballot as BallotModel} from '../models/ballot'
import {Candidate} from '../models/election'
import _  from 'lodash'

import {Motion, spring} from 'react-motion';

import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';


// import cardCard from './cardCard'
import CandidateCard from './candidateCard'
import CandidatePool from './candidatePool'
import VotesList from './votesList'
import CardDragLayer from './dragLayer'

const card_TYPE = 'card'

//TODO: switch html5 / touch backends
@DragDropContext(TouchBackend({enableMouseEvents: true}))
// @DragDropContext(HTML5Backend)
@observer
class Ballot extends Component {
    static propTypes = {
        disabled : React.PropTypes.bool,
        ballot : React.PropTypes.instanceOf(BallotModel).isRequired,
        candidates : React.PropTypes.any.isRequired,
    }

    getStyles = () => {
        if(this.props.disabled) {
            return {
                opacity : spring(0),
                candidatesLeft : spring(-100),
                votesLeft : spring(25)
            }
        }

        return {
            opacity : spring(1), 
            candidatesLeft : spring(0),
            votesLeft : spring(50)
        }
    }

    render() {
        return (
            <div className="flex flex-col flex-auto">
                <CardDragLayer candidates={this.props.candidates}></CardDragLayer>
                <Motion style={this.getStyles()}>
                {interpolatedStyle => {
                    let {
                        opacity, 
                        candidatesLeft,
                        votesLeft,
                    } = interpolatedStyle;

                    const leftStyle = {
                        height : '100%',
                        position : 'absolute',
                        transform : `translateX(${candidatesLeft}%)`,
                        opacity : opacity,
                    }

                    const rightStyle = {
                        transform : `translateX(${votesLeft}%)`,
                    }

                    return (
                        <div className="columns flex-auto" style={{position : 'relative'}}>
                            <div className="column is-4 flex" style={leftStyle}>
                                <CandidatePool ballot={this.props.ballot} candidates={this.props.candidates} disabled={this.props.disabled}/>
                            </div>
                            <div className="column is-8 flex" style={rightStyle}>
                                <VotesList ballot={this.props.ballot} candidates={this.props.candidates} disabled={this.props.disabled}/>
                            </div>
                        </div>
                    )
                }}
                
                </Motion>
            </div>
        )
    }
}

export default Ballot