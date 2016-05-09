'use strict';
const React = require('react');

module.exports = (components) => {
  return React.createClass({
    log : function(val) {
      console.log(val);
    },

    render : function() {
      return (
        <div>
          <components.DatetimePicker value={new Date('9/14/86 9:15')}
                                     min={new Date('9/13/86 8:15')}
                                     max={new Date('9/15/86 10:15')}
                                     onChange={this.log}/>
        </div>
      )
    },
  })
}