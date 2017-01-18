import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash'

import {CandidateCard} from './candidateCard'

function collect(monitor) {
    return {
        item: monitor.getItem(),
        currentOffset: monitor.getClientOffset(),
        isDragging: monitor.isDragging()
    }
}

const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
};

@observer
@DragLayer(collect)
export default class CardDragLayer extends Component{
    static propTypes = {
        item: React.PropTypes.object,
        currentOffset: React.PropTypes.shape({
            x: React.PropTypes.number.isRequired,
            y: React.PropTypes.number.isRequired
        }),
        isDragging: React.PropTypes.bool.isRequired,
        candidates: React.PropTypes.any.isRequired,
    };

    @observable
    size = {}

    measure = () => {
        const {card} = this;

        if(card == null) {
            return;
        }
        const el = card.children[0]

        const size = {
            width : el.offsetWidth,
            height : el.offsetHeight,
        }

        if(!_.isEqual(size, toJS(this.size))) {
            console.log(size)
            this.size = size;
        }
    }
    componentDidUpdate = this.measure;

    getItemStyles = () => {
        const { currentOffset, initialOffset } = this.props;
        if (!currentOffset) {
            return {
                display: 'none'
            };
        }

        let { x, y } = currentOffset;
        const {width, height} = this.size || {width : 0, height : 0}

        x = x - width / 2
        y = y - height / 2

        const transform = `translate(${x}px, ${y}px)`;
        return {
            transform: transform,
            WebkitTransform: transform,
            opacity: '0.5',
            trasition : 'all 0.3s'
        };
    }

    render() {
        const { item, itemType, isDragging, currentOffset } = this.props;

        if (!isDragging) {
            return null;
        }

        const candidate = _.find(this.props.candidates, {title : item.candidateId})

        return (
            <div style={layerStyles}>
                <div style={this.getItemStyles()} ref={el => this.card = el}>
                    <CandidateCard className="dragging-card card z-2" candidate={candidate}/>
                </div>
            </div>
        );
    }
}