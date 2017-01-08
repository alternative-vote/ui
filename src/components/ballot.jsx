import React, { Component } from 'react';
import mobx, { observable, action } from "mobx";
import { observer, inject } from "mobx-react";

import {Ballot as BallotModel} from '../models/ballot'
import {Candidate} from '../models/election'
import _  from 'lodash'

import {StaggeredMotion, spring} from 'react-motion';

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
        
        const oneSixth = (1/6) * 100;
        if(this.props.disabled) {
            return [
                {
                    opacity : spring(0, {stiffness: 1000}), 
                    none : 0,
                }, {
                    height : spring(0),
                    width : spring(0),
                    opacity : spring(0), 
                }, {
                    marginLeft : spring(oneSixth)
                },
            ]
        }

        return [
            {
                opacity : spring(1), 
                none : 1000,
            }, {
                height : spring(100),
                width : spring(2 * oneSixth),
                opacity : spring(1, {stiffness: 1000}), 
            }, {
                marginLeft : spring(2 * oneSixth)
            },
        ]
    }

    render() {
        return (
            
            <div className="flex flex-col flex-auto">
                <CardDragLayer candidates={this.props.candidates}></CardDragLayer>
                    <StaggeredMotion styles={this.getStyles}>
                    {interpolatedStyles => {
                        let [ innerStyle, leftStyle, rightStyle ] = interpolatedStyles;

                        innerStyle = {
                            opacity: innerStyle.opacity,
                            display : innerStyle.opacity <= 0 ? 'none' : null
                        }

                        leftStyle = {
                            position : 'absolute',
                            alignSelf : 'center',
                            height : `${leftStyle.height}%`,
                            width : `${leftStyle.width}%`,
                            opacity : leftStyle.opacity,
                        }

                        rightStyle = {
                            marginLeft : `${rightStyle.marginLeft}%`
                        }

                        return (
                            <div className="columns flex-auto" style={{position : 'relative'}}>
                                <div className="column is-4 flex" style={leftStyle}>
                                    <CandidateList style={innerStyle} ballot={this.props.ballot} candidates={this.props.candidates} disabled={this.props.disabled}/>
                                </div>
                                <div className={"column is-8 flex" + (this.props.disabled ? " is-offset-2" : " is-offset-4")} style={rightStyle}>
                                    <VotesList ballot={this.props.ballot} candidates={this.props.candidates} disabled={this.props.disabled}/>
                                </div>
                            </div>
                        )
                        // return <div>Hello world</div>
                    }}
                    
                    </StaggeredMotion>
            </div>
        )
    }
}

export default Ballot