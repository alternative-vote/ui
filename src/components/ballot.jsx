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
import CandidateList from './candidateList'
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

    getUnusedCandidates = () => {
        return _.difference(this.props.candidates, this.props.ballot.votes)
    }

    @action
    moveCandidate = (cardId, targetIndex) => {
        const candidates = this.props.candidates
        const currentIndex = _.findIndex(candidates, {id : cardId})
        const card = candidates[currentIndex]
        candidates.splice(currentIndex, 1)
        candidates.splice(targetIndex, 0, card)

        return targetIndex
    }

    getCandidateListStyle = () => {
        if (this.props.disabled) {
            return {
                height : spring(0),
                width : spring(0),
                opacity : spring(0),
                innerOpacity : spring(0),
            }
        } else {
            return {
                height : spring(100),
                width : spring(33.33333),
                opacity : spring(1),
                innerOpacity : spring(1, {stiffness: 1000}),
            }
        }
    }

    getVoteListStyle = () => {
        
    }

    // candidateList = () => {
    //     return (
    //         <Motion
    //             style={this.getCandidateListStyle()}>
    //             {interpolatedStyle => {
    //                 const {height, width, opacity, innerOpacity} = interpolatedStyle;
    //                 const style = {
    //                     overflow : 'visible',
    //                     alignSelf : 'center',
    //                     position : 'absolute',
    //                     height : `${height}%`,
    //                     width : `${width}%`,
    //                     opacity : opacity,
    //                 }

    //                 const innerStyle = {
    //                     // position : 'absolute',
    //                     // height : '100%',
    //                     opacity : innerOpacity,
    //                 }
    //                 return (
    //                     <div className="column is-4 flex" style={style}>
    //                         <CandidateList style={innerStyle} ballot={this.props.ballot} candidates={this.props.candidates} disabled={this.props.disabled}/>
    //                     </div>
    //                 )
    //             }}
    //         </Motion>
    //     )
    // }

    getStyles = () => {
        console.log('getstyles');
        
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
                        // marginLeft : `${left}%`,
                        transform : `translateX(${candidatesLeft}%)`,
                        opacity : opacity,
                    }

                    const rightStyle = {
                        transform : `translateX(${votesLeft}%)`,
                        // marginLeft : `${marginLeft}%`
                    }

                    return (
                        <div className="columns flex-auto" style={{position : 'relative'}}>
                            <div className="column is-4 flex" style={leftStyle}>
                                <CandidateList ballot={this.props.ballot} candidates={this.props.candidates} disabled={this.props.disabled}/>
                            </div>
                            <div className="column is-8 flex" style={rightStyle}>
                                <VotesList ballot={this.props.ballot} candidates={this.props.candidates} disabled={this.props.disabled}/>
                            </div>
                        </div>
                    )
                    // return <div>Hello world</div>
                }}
                
                </Motion>
            </div>
        )
    }
}

export default Ballot