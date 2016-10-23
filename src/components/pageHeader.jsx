const {Link} = require('react-router');
const React = require('react');

module.exports = function(routes) {
  return React.createClass({
    render : function() {
      return (
        <section className="hero is-primary">
        <div className="bg-primary700">
          &nbsp;
        </div>
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              <Link to={routes.home()}>Votr</Link>
            </h1>
            <h2 className="subtitle">Edit Election</h2>
          </div>
        </div>
      </section>
    )}
  });
}
