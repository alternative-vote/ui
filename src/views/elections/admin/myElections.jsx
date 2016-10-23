const {withRouter, Link} = require('react-router');
const React = require('react');

module.exports = (state, routes, electionService) => {

  return withRouter(React.createClass({
    getInitialState : function () {
      return {
        elections : []
      }
    },

    componentDidMount : function () {
      this._unwatches = [
        state.watch('myElections', (elections) => {
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
          <section className="hero is-primary">
            <div className="bg-primary700">
              &nbsp;
            </div>
            <div className="hero-body">
              <div className="container">
                <h1 className="title">
                  Votr
                </h1>
                <h2 className="subtitle">
                  My elections
                </h2>
              </div>
            </div>
          </section>
          <section className="section">
            <div className="container">
              {
                this.state.elections.map((election) => {
                  return (
                    <div className="level" key={election.id}>
                      <div className="card">
                        <header className="card-header">
                          <span className="card-header-title">
                            <Link to={routes.editElection({electionId : election.id})}>
                              {election.name}
                            </Link>
                          </span>
                        </header>
                        <div className="card-content">
                          <div className="content">
                            Some info about this election.
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }

              <div>
                <button className="button is-primary" onClick={this.createElection}>New Election</button>
              </div>
            </div>
          </section>




        </div>
      )
    }
  }));
}
