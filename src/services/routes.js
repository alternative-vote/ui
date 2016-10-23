'use strict';

module.exports = () => {
  const routes = {
    home                : '/',
    join                : '/join',
    login               : '/login',
    editElection        : '/elections/:electionId/edit',
    vote                : '/elections/:electionId/vote',
    voteCategory        : '/elections/:electionId/vote/:category',
    voteSummary         : '/elections/:electionId/vote/summary',
    results             : '/elections/:electionId/results',
  }

  function buildApi(api, key) {
    const path = routes[key];

    api[key] = function (pathVars) {
      if (pathVars == null) {
        return path;
      }

      const pathParts = path.split('/');
      const replaced  = pathParts.map((part) => {
        if (part[0] == ':') {
          const pathKey = part.slice(1)
          const pathVar = pathVars[pathKey];
          if (pathVar == null) {
            throw new Error(`Building a route requires all path variables. Variable ${pathKey} is not defined for route ${key}`);
          }

          return pathVar;
        }

        return part;
      });

      return replaced.join('/');
    }

    return api;
  }

  return Object.keys(routes).reduce(buildApi, {});
}
