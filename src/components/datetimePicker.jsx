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
      min      : React.PropTypes.instanceOf(Date),
      max      : React.PropTypes.instanceOf(Date),
      onChange : React.PropTypes.func
    },

    getDefaultProps : function () {
      return {
        value    : new Date(),
        min      : null,
        max      : null,
        onChange : function () {
        }
      }
    },

    getInitialState : function () {
      return {
        date    : this._makeDateString(this.props.value),
        time    : this._makeTimeString(this.props.value),
        minDate : this._makeDateString(this.props.min),
        maxDate : this._makeDateString(this.props.max),
        minTime : this._makeTimeString(this.props.min),
        maxTime : this._makeTimeString(this.props.max),
      }
    },

    _makeDateString : function (date) {
      if (date == null) {
        return '';
      }
      return moment(date).format(DATE_FORMAT)
    },

    _makeTimeString : function (date) {
      if (date == null) {
        return '';
      }
      return moment(date).format(TIME_FORMAT)
    },

    componentWillReceiveProps : function (nextProps) {
      this.setState({
        date    : this._makeDateString(nextProps.value),
        time    : this._makeTimeString(nextProps.value),
        minDate : this._makeDateString(nextProps.min),
        maxDate : this._makeDateString(nextProps.max),
        minTime : this._makeTimeString(nextProps.min),
        maxTime : this._makeTimeString(nextProps.max),
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
          <input type="date"
                 value={this.state.date}
                 min={this.state.minDate}
                 max={this.state.maxDate}
                 onChange={this.setDate}/>
          <input type="time"
                 value={this.state.time}
                 min={this.state.date == this.state.minDate ? this.state.minTime : ''}
                 max={this.state.date == this.state.maxDate ? this.state.maxTime : ''}
                 onChange={this.setTime}/>
        </div>
      )
    },
  })
};