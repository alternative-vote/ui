import React, { Component } from 'react';
import { autorun, action, observable, toJS } from "mobx";
import { observer } from "mobx-react";
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';

import {Ballot as BallotModel} from '../models/ballot'

import CandidateCard from './candidateCard'

const PADDING=20
const TRANSITION = 'all 0.3s'

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

    @observable
    positions = {};

    constructor(props) {
        super(props);

        autorun(() => {
            this.candidates = toJS(_.difference(this.props.candidates, this.props.ballot.votes))
        })
    }

    @action
    setYPoisitons = () => {
        const newPositions = {}
        this.candidates.forEach((candidate, i) => {
            const {id} = candidate;
            const currentPosition = this.positions[id] || {}

            const y = this.candidates.slice(0, i).reduce((sum, candidate) => {
                const {el} = candidate
                return sum + el.offsetHeight + PADDING
            }, 0)
            
            const init = currentPosition.y == null;

            // console.log('assigning', i, y)
            newPositions[id] = {init, y}
        }, {})

        if(!_.isEqual(newPositions, toJS(this.positions))) {
            this.positions = newPositions;
        }
    }
    componentDidMount = this.setYPoisitons
    componentDidUpdate = this.setYPoisitons    

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
        console.log('rendering')
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
                    {this.candidates.map((candidate, i) => {
                        const {id} = candidate;
                        const {y, init} = this.positions[id] || {};

                        const style = {
                            position: 'absolute',
                            width: '100%',
                            marginBottom: `${PADDING}px`,
                            transform : y == null ? 'none' : `translateY(${y}px)`,
                            transition : init ? 'none' : TRANSITION
                        }

                        return (
                            <div key={candidate.id} style={{...style}} ref={(el) => {candidate.el=el}}>
                                <CandidateCard index={i} candidate={candidate} details disabledDrop/>
                            </div>
                        )}
                    )}
                    </div>
                </div>
                <div className="scroll-fade-bottom"></div>
                </div>
            </div>
        )
    }
}