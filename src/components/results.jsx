import React, { Component } from 'react';
import {CandidateCard} from './candidateCard'
import AnimatedList from './animatedList'
const moment = require('moment');

export default class Results extends Component {
    static propTypes = {
        results : React.PropTypes.any.required
    }

    getItems() {
        const items = []

        this.props.results.orderedCandidates.forEach((candidate, i) => {
            items.push(
                <CandidateCard key={candidate.title} className="is-fullwidth"
                    candidate={candidate} style={{height: '59px', marginBottom: '12px', alignItems: 'center'}}/>
            );
        });

        return items;
    }

    render () {
        const items = this.getItems();

        const {start, end, numVoters, ballotsSubmitted, averageCandidatesRanked } = this.props.results.stats;

        const responseRate = Math.round((ballotsSubmitted / numVoters) * 100)
        const diff = moment(end) - moment(start);
        const runtime = moment.duration(diff).humanize()

        return (
            <div>
            <div className="card z-2 is-fullwidth ">
                <div className="card-content level">
                    <div className="level-item has-text-centered">
                        <p className="heading">Runtime</p>
                        <h1 className="title">{runtime}</h1>
                    </div>
                    <div className="level-item has-text-centered">
                        <p className="heading">Voters</p>
                        <h1 className="title">{numVoters}</h1>
                    </div>
                    <div className="level-item has-text-centered">
                        <p className="heading">Response Rate</p>
                        <h1 className="title">{responseRate}%</h1>
                    </div>
                    <div className="level-item has-text-centered">
                        <p className="heading">Average Length of Ballot</p>
                        <h1 className="title">{averageCandidatesRanked}</h1>
                    </div>
                </div>
            </div>
            <br/>
            <div className="card z-2 is-fullwidth candidate-list">
                <div className="card-content ">
                    <div>
                        <h1 className="title has-text-centered">Results</h1>
                    </div>
                </div>
                <div className="">
                    <div className="scroll-fade-top"></div>
                    <div className="card-content ">
                        {(items.length == 0) ? (
                            <div className="has-text-centered">
                                <small>Results are being calculated. Please try again in a moment.</small>
                            </div>
                        ) : null}
                        <div className="columns" style={{position: 'relative'}}>
                            <div className="column is-1 is-offset-1">
                                <div style={{position:'relative'}}>
                                    {items.map((vote, i) => 
                                        <div key={i} className="flex has-text-centered" style={{height: '59px', marginBottom: '12px', alignItems: 'center'}}>
                                            <h1  className="title" style={{margin : 'auto'}}>{i+1}</h1>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="column is-9">
                                <div style={{position:'relative'}}>
                                    {items}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="scroll-fade-bottom"></div>
                </div>
            </div>
            </div>
        )
    }
}