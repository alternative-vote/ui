'use strict';
const React = require('react');

module.exports = (state) => {
  return React.createClass({
    componentDidMount : function() {
      this._unwatches = [
        state.editing.watch(['name', 'description', 'start', 'end'])
      ]
    },

    componentWillUnmount : function() {
      for(const unwatch of this._unwatches) {
        unwatch();
      }
    },

    setProperty : function(key) {
      return (e) => {
        console.log('changing key')
        state.editing[key] = e.target.value;
      }
    },

    render : function() {
      return (
        <form>
          <input type="text" value={state.editing.name} onChange={setProperty('name')}/>
          <input type="text" value={state.editing.description} onChange={setProperty('description')}/>
          <input type="text" value={state.editing.start} onChange={setProperty('start')}/>
          <input type="text" value={state.editing.end} onChange={setProperty('end')}/>
        </form>
      )
    },
  })
}