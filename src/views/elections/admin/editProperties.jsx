'use strict';
const React  = require('react');
const moment = require('moment');

module.exports = (DatetimePicker, model) => {
  return React.createClass({
    getInitialState : function () {
      return {
        name        : '',
        description : '',
        start       : new Date(),
        end         : new Date(),
      }
    },

    componentDidMount : function () {
      this._unwatches = [
        model.watch(['editing'], (editing) => {
          if (editing == null) {
            return;
          }
          const {name, description, start, end} = editing;
          this.setState({
            name, description,
            start : start.date,
            end : end.date
          });
        })
      ]
    },

    componentWillUnmount : function () {
      for (const unwatch of this._unwatches) {
        unwatch();
      }
    },

    setProperty : function (key) {
      return (e) => {
        this.setState({
          [key] : e.target.value
        });
        //model.editing[key] = e.target.value;
      }
    },

    setDateProperty : function(key) {
      return (value) => {
        console.log(key, value);
        this.setState({
          [key] : value
        });
        //model.editing[key] = value;
      }
    },

    render : function () {
      return (
        <form>
          <input type="text" value={this.state.name} onChange={this.setProperty('name')}/>
          <input type="text" value={this.state.description} onChange={this.setProperty('description')}/>
          <DatetimePicker value={this.state.start} onChange={this.setDateProperty('start')}/>
          <DatetimePicker value={this.state.end} onChange={this.setDateProperty('end')}/>
        </form>
      )
    },
  })
}