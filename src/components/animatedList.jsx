import React, { Component } from 'react';
import { action, observable, toJS } from "mobx";
import { observer } from "mobx-react";

const PADDING=20
const DURATION = 300;
const EASE = 'cubic-bezier(0.215, 0.61, 0.355, 1)'
const TRANSITION = `transform ${DURATION}ms ${EASE}, opacity ${DURATION * 0.6}ms ${EASE} ${DURATION * 0.4}ms`

@observer
export default class AnimatedList extends Component {
    @observable
    positions = {};

    endAnimation = (key) => {
        this.positions[key].moving = false;
    }

    @action
    setYPoisitons = () => {
        const newPositions = {}

        const {container} = this.refs;
        const elements = [...container.children];
        React.Children.forEach(this.props.children, (child, i) => {
            const {key} = child;
            const currentPosition = this.positions[key] || {}
            
            const y = elements.slice(0, i).reduce((sum, el) => {
                return sum + el.offsetHeight + PADDING
            }, 0)

            const init = currentPosition.y == null;
            const moving = y != currentPosition.y || currentPosition.moving;

            newPositions[key] = {init, moving, y}
        })

        if(!_.isEqual(newPositions, toJS(this.positions))) {
            this.positions = newPositions;
        }
    }
    componentDidMount = this.setYPoisitons
    componentDidUpdate = this.setYPoisitons

    render() {
        return (
            <div ref="container">
                {this.props.children.map((child, i) => {
                    const {key} = child;
                    const {y, init, moving} = this.positions[key] || {};

                    const style = {
                        width : '100%',
                        position: 'absolute',
                        marginBottom: `${PADDING}px`,
                        transform : y == null ? 'none' : `translateY(${y}px)`,
                        transition : init ? 'none' : TRANSITION,
                        opacity : init ? '0' : '1',
                        pointerEvents : moving ? 'none' : 'auto',
                        // width: init ? '0%' : '100%',
                        // height: init ? '0%' : '100%',
                    }

                    return (
                        <div key={key} style={{...style}} onTransitionEnd={() => this.endAnimation(key)}>
                            {child}
                        </div>
                )})}
            </div>
        )
    }
}