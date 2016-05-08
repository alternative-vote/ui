const test = require('tape');
const routes = require('./routes')();

test('it returns a simple route', (t) => {
  t.equal(routes.home(), '/');
  t.end();
});

test('it creates a route with vars', (t) => {
  t.equal(routes.configure(), '/elections/:id/configure');
  t.end();
});

test('it replaces route vars', (t) => {
  t.equal(routes.configure({id : 7}), '/elections/7/configure');
  t.end();
});

test('it throws an error if a path var is not defined', (t) => {
  t.throws(() => {
    routes.configure({})
  });
  t.end();
});