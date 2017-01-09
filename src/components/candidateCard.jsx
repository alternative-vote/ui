import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import {toJS} from 'mobx';

const cardSource = {
    beginDrag(props) {
        return {
            candidateId : props.candidate.id,
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
        const draggingId = monitor.getItem().candidateId;
        const targetId = props.candidate.id

        if (draggingId === targetId) {
            return;
        }
        
        monitor.getItem().index = props.onHover(draggingId, targetId);
    }
}

function targetCollector(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget()
    }
}

export class CandidateCard extends Component {
    static propTypes = {
        details : React.PropTypes.bool,
        candidate : React.PropTypes.any.isRequired,
    }

    render() {
        let style = {
            display : 'block',
        }
        if (!this.props.details) {
            style = {
                display : 'block',
                overflow : 'hidden',
                textOverflow : 'ellipsis',
                whiteSpace : 'nowrap',
            }
        }

        return (
            <div className={this.props.className} style={this.props.style}>
            <div className="card-content">
                <strong style={style}>{this.props.candidate.title}</strong>
                <small style={style}>{this.props.candidate.subtitle}</small>
                {this.props.details ? this.props.candidate.description : ''}
            </div>
            </div>
        )

        
    }
}

@DragSource('candidate', cardSource, sourceCollector)
@DropTarget('candidate', cardTarget, targetCollector)
export class DraggableCandidateCard extends Component {
    static propTypes = {
        draggable : React.PropTypes.bool,
        droppable : React.PropTypes.bool,
        onHover : React.PropTypes.func,
        details : React.PropTypes.bool,
        candidate : React.PropTypes.any.isRequired,
    }

    render() {
        const { draggingId, draggable, droppable, connectDropTarget,  connectDragSource} = this.props;
        const isDragging = draggable && draggingId == this.props.candidate.id
        
        let ui = (
            <div className={(draggable ? "draggable-card" : "") + (isDragging ? " dragging" : "")}>
                <CandidateCard {...this.props}></CandidateCard>
            </div>
        )

        if(droppable) {
            ui = connectDropTarget(ui)
        }
        if(draggable) {
            ui = connectDragSource(ui)
        }

        return ui
    }
}
