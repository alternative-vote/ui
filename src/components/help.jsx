import React, { Component } from 'react';

export default class Help extends Component {
    static propTypes = {
        disabled : React.PropTypes.bool,
        onClose : React.PropTypes.func.required,
    }

    killPropagation = (e) => {
        e.stopPropagation();
    }
    
    render () {
        const style = {
            display : this.props.disabled ? 'none' : 'block',
        }

        return (
            <div className="modal-background" onClick={this.props.onClose} style={style}>
                <div className="flex flex-col flex-auto full-height">
                    <div className="container" style={{margin : 'auto'}}>
                    <div className="columns">
                    <div className="column is-10 is-offset-1">
                    <div className="message z-3" onClick={this.killPropagation}>
                    <div className="content">
                        <div className="message-header">
                        <div className="level">
                        <div className="level-item">
                            Electioneer Help
                        </div>
                        <div className="level-right">
                        <div className="level-item">
                            <button className="delete" onClick={this.props.onClose}>X</button>
                        </div>
                        </div>
                        </div>
                        </div>
                        <div className="message-body" style={{height : '63%', overflow: 'auto'}}>
                        <p>
                            Electioneer uses the <a href="https://en.wikipedia.org/wiki/Instant-runoff_voting" target="_blank">instant runoff voting system</a> to guarantee fair election results with ballots that are easy to use and understand.
                        </p>
                        <h6><strong>How do I vote?</strong></h6>
                        <p>
                        The list of all possible candidates is on the left, your ballot is on the right. Drag and drop candidates onto your ballot, ranking them in the order of your preference. You may include as many or as few candidates as you like on your ballot. Once you are finished, submit your ballot.
                        </p>
                        <h6><strong>How are results calculated?</strong></h6>
                        <p>
                        The easiest way to explain how instant runoff voting works is to watch this excellent video from CGPGrey:
                        </p>
                        <iframe width="100%" height="540px" src="https://www.youtube.com/embed/3Y3jE3B8HsE"></iframe>
                        <p>&nbsp;</p>
                        <h6><strong>Why should I care?</strong></h6>
                        <p>
                        The most important thing that instant runoff voting gives us is that it eliminates the need for strategic voting. You don't need to worry if you are "wasting your vote". Instead, you can simply rank the candidates in the order of your preference. You can now rest in peace, happy knowing that your vote will count even if your first choice will not be the winner!
                        </p>
                        </div>
                        </div>
                    </div>
                    </div>
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}