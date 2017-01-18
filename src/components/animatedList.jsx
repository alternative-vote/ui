import React, { Component } from 'react';
import { action, observable, toJS } from "mobx";
import { observer } from "mobx-react";
import {Motion, TransitionMotion, spring} from 'react-motion';

const PADDING=20
const DURATION = 300;
const EASE = 'cubic-bezier(0.215, 0.61, 0.355, 1)'
const TRANSITION = `transform ${DURATION}ms ${EASE}, opacity ${DURATION * 0.8}ms ${EASE} ${DURATION * 0.2}ms`

@observer
export default class AnimatedList extends Component {
    static propTypes = {
        fixedHeight : React.PropTypes.number, 
        animateEnterLeave : React.PropTypes.bool, 
    }

    constructor(props) {
        super(props)

        if (this.props.fixedHeight == null) {
            this.componentDidMount = this.setYPoisitons
            this.componentDidUpdate = this.setYPoisitons
        }
    }

    @observable
    positions = {};

    endAnimation = (key) => {
        this.positions[key].moving = false;
    }

    @action
    setYPoisitons = () => {
        const newPositions = {}

        const {container} = this;
        if(container == null) {
            return;
        }
        const elements = [...container.children];
        React.Children.forEach(this.props.children, (child, i) => {
            const {key} = child;
            const currentPosition = this.positions[key] || {}

            const height = currentPosition.height || elements[i].offsetHeight;
            
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

    getStyles = () => {
        return React.Children.map(this.props.children, (child, i) => {
            const {fixedHeight} = this.props;
            const {key} = child;

            let y, currentY;
            if(fixedHeight == null) {
                const position = this.positions[key] || {}
                const y = position.y || 0;
                const init = position.init || false;

                currentY = y;
                if(init === false) {
                    currentY = spring(y)
                }    
            } else {
                y = i * fixedHeight;
                currentY = spring(y);
            }

            return {
                key,
                data : { 
                    child,
                    finalY : y
                },
                style : { 
                    y : currentY,
                    opacity : spring(1),
                },
            }
        }) || []
    }

    willEnter = (currentStyle) => {
        let currentY = currentStyle.style.y;
        if (currentY.val != null) {
            currentY = currentY.val;
        }
        return {
            y : currentY,
            opacity : 0
        }
    }

    willLeave = (currentStyle) => {
        let currentY = currentStyle.style.y;
        if (currentY.val != null) {
            currentY = currentY.val;
        }
        return {
            y : currentY,
            opacity : spring(0)
        }

        // return null;
    }

    render() {
        let transitions = {}
        if (this.props.animateEnterLeave) {
            transitions = {
                willEnter : this.willEnter,
                willLeave : this.willLeave
            }
        }

        return (
            <TransitionMotion 
                {...transitions}
                styles={this.getStyles()}>
                {interpolatedStyles => 
                    <div ref={el => this.container = el}>
                        {interpolatedStyles.map(config => {
                            const {y, opacity} = config.style;
                            const disabled = Math.abs(y - config.data.finalY) > PADDING
                            
                            const style = {
                                width : '100%',
                                position: 'absolute',
                                marginBottom: `${PADDING}px`,
                                transform : y == null ? 'none' : `translateY(${y}px)`,
                                pointerEvents : disabled ? 'none' : 'auto',
                                opacity : opacity == null ? '1' : opacity,
                                // transition : init ? 'none' : TRANSITION,
                                // opacity : init ? '0' : '1',
                                // width: init ? '0%' : '100%',
                                // height: init ? '0%' : '100%',
                            }

                            return (
                                <div key={config.key} style={{...style}}>
                                    {config.data.child}
                                </div>
                            )
                        })}
                    </div>
                }
            </TransitionMotion>
        )
    }
}