const {withRouter, Link} = require('react-router');
const React = require('react');

module.exports = (model, electionService) => {

  return withRouter(React.createClass({
    getInitialState : function () {
      return {
        elections : []
      }
    },

    componentDidMount : function () {
      this._unwatches = [
        model.watch('myElections', (elections) => {
          this.setState({ elections })
        })
      ]

      electionService.getMyElections();
    },

    componentWillUnmount : function () {
      for (const unwatch of this._unwatches) {
        unwatch();
      }
    },

    createElection : function() {
      electionService.createElection().then((election) => {
        this.props.router.push(`/elections/${election.id}/configure/properties`)
      });
    },

    render : function () {
      return (
        <div>
          <h1>My Elections</h1>

          <div>
            <button onClick={this.createElection}>New Election</button>
          </div>

          {
            this.state.elections.map((election) => {
              return (
                <div key={election.id}>
                  {election.name}
                  <Link to={`/elections/${election.id}/configure/properties`}>edit</Link>
                </div>
              )
            })
          }
        </div>
      )
    }
  }));
}