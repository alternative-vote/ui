import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';
import _ from 'lodash'

import {CandidateCard} from './candidateCard'

function getItemStyles(props) {
  const { currentOffset, initialOffset } = props;
  if (!currentOffset) {
    return {
      display: 'none'
    };
  }

  let { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform: transform,
    WebkitTransform: transform,
    opacity: '0.5',
    trasition : 'all 0.3s'
  };
}

function collect(monitor) {
    return {
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
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

@DragLayer(collect)
export default class CardDragLayer extends Component{
    static propTypes = {
        item: React.PropTypes.object,
        itemType: React.PropTypes.string,
        currentOffset: React.PropTypes.shape({
            x: React.PropTypes.number.isRequired,
            y: React.PropTypes.number.isRequired
        }),
        isDragging: React.PropTypes.bool.isRequired,
        candidates: React.PropTypes.any.isRequired,
    };

    render() {
        const { item, itemType, isDragging, currentOffset } = this.props;

        if (!isDragging) {
            return null;
        }

        const candidate = _.find(this.props.candidates, {id : item.candidateId})

        return (
            <div style={layerStyles}>
                <div style={getItemStyles(this.props)}>
                    <CandidateCard className="dragging-card card z-2" candidate={candidate}/>
                </div>
            </div>
        );
    }
}