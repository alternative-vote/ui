const {withRouter, Link} = require('react-router');
const React = require('react');

module.exports = (state, electionService, routes, PageHeader, EditElectionForm) => {
  return withRouter(React.createClass({
    getInitialState : function() {
      return {
        loading : true,
        election : null,
        notFound : false,
      }
    },

    componentDidMount : function() {
      electionService.getElection(this.props.routeParams.electionId).then((election) => {
        this.setState({loading : false, election});
      });
    },

    render : function () {
      return (
        <div>
          <PageHeader/>
          <nav className="nav z-2">
            <div className="container">
              <div className="nav-center">
                <a className="nav-item is-tab is-active">Election</a>
                <a className="nav-item is-tab">Candidates</a>
                <a className="nav-item is-tab">Permissions</a>
              </div>
            </div>
          </nav>

          <section className="section">
            <div className="container">
              {this.state.loading ? null : <EditElectionForm election={this.state.election}/>}
            </div>
          </section>
        </div>
      )
    },
  }));
}
