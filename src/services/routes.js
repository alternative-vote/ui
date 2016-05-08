'use strict';

module.exports = () => {
  const routes = {
    home                : '/',
    join                : '/join',
    login               : '/login',
    configure           : '/elections/:id/configure',
    configureProperties : '/elections/:id/properties',
    configureCandidates : '/elections/:id/candidates',
    configureCategories : '/elections/:id/categories',
    configureVoters     : '/elections/:id/voters',
    configureSummary    : '/elections/:id/summary',
    vote                : '/elections/:id/vote',
    voteCategory        : '/elections/:id/vote/:category',
    voteSummary         : '/elections/:id/vote/summary',
    results             : '/elections/:id/results',
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