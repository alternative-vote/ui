const {withRouter, Link} = require('react-router');
const React = require('react');
const Formsy = require('formsy-react');

module.exports = (Models, DatetimePicker, CandidatesEditor) => {
  return withRouter(React.createClass({
    propTypes : {
      election : React.PropTypes.object,
      onChange : React.PropTypes.func,
    },

    getInitialState : function () {
      return new Models.Election(this.props.election)
    },

    setProperty : function (key) {
      return (e) => {
        this.setState({
          [key] : e.target.value
        });
        state.editing[key] = e.target.value;
      }
    },

    setDateProperty : function(key) {
      return (value) => {
        console.log(key, value);
        this.setState({
          [key] : value
        });
        state.editing[key].date = value;
      }
    },

    render : function () {
      return (
        <Formsy.Form>
          <h1 className="title">Properties</h1>
          <hr/>
          <label className="label">Name</label>
          <div className="control">
            <input className="input" type="text" value={this.state.name} onChange={this.setProperty('name')}/>
          </div>
          <label className="label">Description</label>
          <div className="control">
            <textarea className="textarea" value={this.state.description} onChange={this.setProperty('description')}/>
          </div>
          <label className="label">Start Date</label>
          <div className="control">
          </div>
          <label className="label">End Date</label>
          <div className="control">
          </div>

          <h1 className="title">Candidates</h1>
          <hr/>
          <CandidatesEditor candidates={this.state.candidates} onChange={this.setProperty('candidates')}/>

          <h1 className="title">Permissions</h1>
          <hr/>

        </Formsy.Form>
      )
    },
  }));
}
