import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import {toJS} from 'mobx';

const cardSource = {
    beginDrag(props) {
        return {
            candidateId : props.candidate.id,
            index : props.index,
        }
    }
}

function sourceCollector(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        draggingId: (monitor.getItem() || {}).candidateId,
    }
}

const cardTarget = {
    hover(props, monitor, component) {
        const candidateId = monitor.getItem().candidateId;
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        if (dragIndex === hoverIndex) {
            return;
        }

        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        
        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        // Time to actually perform the action
        monitor.getItem().index = props.moveCandidate(candidateId, hoverIndex);
    }
}

function targetCollector(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget()
    }
}

//TODO: drag preview
@DragSource('candidate', cardSource, sourceCollector)
@DropTarget('candidate', cardTarget, targetCollector)
class CandidateCard extends Component {
    static propTypes = {
        disabled : React.PropTypes.bool, 
        details : React.PropTypes.bool,
        candidate : React.PropTypes.any.isRequired,
        index : React.PropTypes.number.isRequired,
        moveCandidate : React.PropTypes.func.isRequired,
    }

    render() {
        const { draggingId, connectDragSource, connectDropTarget } = this.props;
        console.log(draggingId,this.props.candidate.id)
        const isDragging = draggingId == this.props.candidate.id

        const ui = (
            <p>
            <div className={"candidate-card card z-1 is-fullwidth" + (isDragging ? " dragging" : "")}>
                <div className="card-content">
                <strong>{this.props.candidate.title}</strong><br/>
                <small>{this.props.candidate.subtitle}</small><br/>
                {this.props.details ? this.props.candidate.description : ''}
                </div>
            </div>
            </p>
        )

        if (this.props.disabled) {
            return ui;
        }

        return connectDragSource(connectDropTarget(ui))
    }
}

export default CandidateCard