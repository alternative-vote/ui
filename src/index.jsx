require('./test.styl');
import {Tree} from 'nject';

import {Election} from '@alternativeVote/data-model';
//const models = require('@alternativeVote/data-model');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
//const election = new models.Election();

//console.log(election);

const a   = 7;
const b   = 9;
const obj = [a, b];

for (const x of obj) {
  console.log(x);
}

class MyComponent extends React.Component {
  render() {
    return <div>What is up my friends</div>;
  }
}

ReactDOM.render(<MyComponent />, document.getElementById('app'));
