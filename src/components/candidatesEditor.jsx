const React  = require('react');
const _ = require('lodash');

module.exports = function(CandidateCard) {
  return React.createClass({
    propTypes : {
      candidates : React.PropTypes.array,
      onChange : React.PropTypes.func,
    },

    getDefaultProps : function() {
      return {
        candidates : [],
        onChange : _.noop,
      }
    },

    getInitialState : function() {
      return {
        candidates : [].concat(this.props.candidates),
        editModel : {
          name : '',
          description : '',
        }
      }
    },

    addCandidate : function() {
      this.setState({
        candidates : this.state.candidates.concat(this.state.editModel),
        editModel : {
          name : '',
          description : '',
        }
      });
      this.props.onChange(this.state.candidates);
    },

    setName : function(e) {
      this.setState({
        editModel : {
          name : e.target.value,
          description : this.state.editModel.description,
        }
      })
    },

    setDescription: function(e) {
      this.setState({
        editModel : {
          name : this.state.editModel.name,
          description : e.target.value,
        }
      })
    },

    render : function() {
      return (
        <div>
          <div className="control">
            <input type="text" className="input" value={this.state.editModel.name} onChange={this.setName}/>
            <input type="text" className="input" value={this.state.editModel.description} onChange={this.setDescription}/>
            <button className="button" onClick={this.addCandidate}>Add</button>
          </div>
          {
            this.state.candidates.map((candidate, i) => <CandidateCard key={i} candidate={candidate}/>)
          }
        </div>
      )
    }
  });
}
