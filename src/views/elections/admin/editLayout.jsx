const {withRouter, Link} = require('react-router');
const React = require('react');

module.exports = (state, electionService) => {
  return withRouter(React.createClass({
    componentDidMount : function() {
      electionService.getElection(this.props.routeParams.id).then((election) => {
        state.editing = election;
      });
    },

    render : function () {
      return (
        <div>
          <div>
            Edit Layout
            <Link to={`/elections/${this.props.routeParams.id}/configure/properties`}>Properties</Link>
            <Link to={`/elections/${this.props.routeParams.id}/configure/candidates`}>Candidates</Link>
            <Link to={`/elections/${this.props.routeParams.id}/configure/categories`}>Categories</Link>
            <Link to={`/elections/${this.props.routeParams.id}/configure/summary`}>Summary</Link>
          </div>
          {this.props.children}
          <div>
            //TODO: prev / next buttons, state tracking
          </div>
        </div>
      )
    },
  }));
}
