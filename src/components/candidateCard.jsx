const React  = require('react');

module.exports = function() {
  return React.createClass({
    propTypes : {
      candidate : React.PropTypes.object
    },

    render : function() {
      return (
        <div className="card">
          <header className="card-header">
            <span className="card-title">{this.props.candidate.name}</span>
          </header>
        </div>
      )
    }
  });
}
