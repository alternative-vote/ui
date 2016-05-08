'use strict';
const React  = require('react');
const moment = require('moment');
const _      = require('lodash');

const DATE_FORMAT = 'YYYY-MM-DD'
const TIME_FORMAT = 'HH:mm'

module.exports = function () {
  return React.createClass({
    propTypes : {
      value    : React.PropTypes.instanceOf(Date),
      onChange : React.PropTypes.func
    },

    getDefaultProps : function () {
      return {
        value    : new Date(),
        onChange : function () {
        }
      }
    },

    getInitialState : function () {
      return {
        date : moment(this.props.value).format(DATE_FORMAT),
        time : moment(this.props.value).format(TIME_FORMAT),
      }
    },

    componentWillReceiveProps : function (nextProps) {
      const value = nextProps.value;
      this.setState({
        date : moment(value).format(DATE_FORMAT),
        time : moment(value).format(TIME_FORMAT),
      });
    },

    shouldComponentUpdate : function (nextProps, nextState) {
      return !_.isEqual(nextState, this.state);
    },

    componentDidUpdate : function () {
      const datetime        = `${this.state.date} ${this.state.time}`;
      const DATETIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

      const newValue = moment(datetime, DATETIME_FORMAT).toDate();
      this.props.onChange(newValue);
    },

    setDate : function (e) {
      this.setState({
        date : e.target.value
      });
    },

    setTime : function (e) {
      this.setState({
        time : e.target.value
      });
    },

    render : function () {
      return (
        <div>
          <input type="date" value={this.state.date} onChange={this.setDate}/>
          <input type="time" value={this.state.time} onChange={this.setTime}/>
        </div>
      )
    },
  })
};