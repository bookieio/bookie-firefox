/*jshint moz:true*/
var Request = require("./request").Request,
    _ = require('lodash.min');


var ApiBase = function (config) {
    if (!config)
        throw('Api configuration data is required.');

    var defaultReqParams = {'api_key': encodeURIComponent(config.api_key)};

    var call = function (endpoint, params, cb, scope) {

        if (scope) {
          if (cb.success) {
              cb.success.bind(scope);
          }

          if (cb.failure) {
              cb.failure.bind(scope);
          }
        }

        let request = new Request({
            url: config.api_url + config.api_username + endpoint + "?api_key=" + config.api_key,
            content: params,
            onComplete: function (response) {
                console.log('onComplete ajax call');
                console.log(response.status);
                console.log(response.statusText);
                // console.log(response.json);
                // @ToDo Check the response for a status code != 200 or if the json
                // body has an error property in it. If so, this failed and we
                // should call cb.failure.
                cb.success(response);
            }
        });

        console.log(request.url);

        return request;
    };

    var get = function (endpoint, params, cb, scope) {
        call(endpoint, params, cb, scope).get();
    };

    var post = function (endpoint, params, cb, scope) {
        console.log('post');
        console.log(endpoint);
        call(endpoint, params, cb, scope).post();
    };

    var delete_call = function (endpoint, params, cb, scope) {
        call(endpoint, params, cb, scope).delete();
    };

    // expose public things
    return {
        delete: delete_call,
        get: get,
        post: post
    };
};


exports.BookieApi = function (config) {

    var _api = ApiBase(config);

    var calls = {
        bmark: function (hash_id, callbacks, bind_scope) {
            var api_url_append = "/bmark/" + hash_id;
            _api.get(api_url_append,
                     {last_bmark: true},
                     callbacks,
                     bind_scope);
        },
        remove: function (hash_id, callbacks, bind_scope) {
            var api_url_append = "/bmark/" + hash_id;
            _api.delete(api_url_append, {}, callbacks, bind_scope);
        },
        save: function (tab_data, callbacks, bind_scope) {
            console.log('save data');

            // If the hash_id is part of the data, we're editing an existing
            // bookmark. Make sure we add that to the url.
            var api_url_append = "/bmark";
            _api.post(api_url_append, tab_data, callbacks, bind_scope);
        },

        ping: function (callbacks, bind_scope) {
            var api_url_append = "/ping";
            _api.get(api_url_append, {}, callbacks, bind_scope);
        },

        sync: function (callbacks, bind_scope) {
            var api_url_append = "/extension/sync";
            _api.get(api_url_append, {}, callbacks, bind_scope);
        }
    };

    return calls;
};
