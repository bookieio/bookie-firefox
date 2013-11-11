var Request = require("sdk/request").Request,
    _ = require('lodash.min.js');


var ApiBase = function(config) {
    if (!config)
        throw('Api configuration data is required.');

    var defaultReqParams = {'api_key': encodeURIComponent(config.api_key)};

    var call = function(endpoint, params, cb, scope) {

        if (scope) {
          if (cb.success) {
              cb.success.bind(scope);
          }

          if (cb.failure) {
              cb.failure.bind(scope);
          }
        }

        let request = Request({
            url: config.api_url + config.api_username + endpoint + "?api_key=" + config.api_key,
            content: params,
            onComplete: function (response) {
                console.log(response);
                // @ToDo Check the response for a status code != 200 or if the json
                // body has an error property in it. If so, this failed and we
                // should call cb.failure.
                cb.success(response);
            }
        });

        console.log(request.url);
        console.log(request.content);

        return request;
    };

    var get = function(endpoint, params, cb, scope) {
        call(endpoint, params, cb, scope).get();
    };

    var post = function(endpoint, params, cb, scope) {
        call(endpoint, params, cb, scope).post();
    };

    // expose public things
    return {
        get: get,
        post: post
    };
};


exports.BookieApi = function(config) {

    var _api = ApiBase(config);

    var calls = {
        save: function(tab_data, callbacks, bind_scope) {
            var api_url_append = "/bmark";
            _api.post(api_url_append, tab_data, callbacks, bind_scope);
        },

        ping: function(callbacks, bind_scope) {
            var api_url_append = "/ping";
            _api.get(api_url_append, callbacks, bind_scope);
        }
    };

    return calls;
};
