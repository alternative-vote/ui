import React, { Component } from 'react';
import {CandidateCard} from './candidateCard'
import AnimatedList from './animatedList'

export default class Results extends Component {
    getItems() {
        const items = []

        this.props.candidates.forEach((candidate, i) => {
            items.push(
                <CandidateCard key={candidate.title} className="is-fullwidth"
                    candidate={candidate}/>
            );
        });

        return items;
    }

    render () {
        const items = this.getItems();

        return (
            <div className="card z-2 is-fullwidth flex flex-auto flex-col candidate-list">
                <div className="card-content flex-none">
                    <div>
                        <h1 className="title has-text-centered">Results</h1>
                    </div>
                </div>
                <div className="flex flex-auto">
                    <div className="scroll-fade-top"></div>
                    <div className="card-content flex-auto scroll">
                        {(items.length == 0) ? (
                            <div className="has-text-centered">
                                <small>Results are being calculated. Please try again in a moment.</small>
                            </div>
                        ) : null}
                        <div className="columns" style={{position: 'relative'}}>
                            <div className="column is-1 is-offset-1">
                                <div style={{position:'relative'}}>
                                <AnimatedList fixedHeight={71} animateEnterLeave >
                                    {items.map((vote, i) => 
                                        <div key={i} className="flex has-text-centered" style={{height: '59px', alignItems: 'center'}}>
                                            <h1  className="title" style={{margin : 'auto'}}>{i+1}</h1>
                                        </div>
                                    )}
                                </AnimatedList>
                                </div>
                            </div>
                            <div className="column is-9">
                                <div style={{position:'relative'}}>
                                <AnimatedList fixedHeight={71} >
                                    {items}
                                </AnimatedList>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="scroll-fade-bottom"></div>
                </div>
            </div>
        )
    }
}