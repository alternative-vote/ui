'use strict';
const React = require('react');

module.exports = (model) => {
  return React.createClass({
    componentDidMount : function() {
      this._unwatches = [
        model.editing.watch(['name', 'description', 'start', 'end'])
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
        model.editing[key] = e.target.value;
      }
    },

    render : function() {
      return (
        <form>
          <input type="text" value={model.editing.name} onChange={setProperty('name')}/>
          <input type="text" value={model.editing.description} onChange={setProperty('description')}/>
          <input type="text" value={model.editing.start} onChange={setProperty('start')}/>
          <input type="text" value={model.editing.end} onChange={setProperty('end')}/>
        </form>
      )
    },
  })
}