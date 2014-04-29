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
                console.log(response.json);

                // Check if either the response status is not 200 or if the response
                // cannot be parsed or if the response body contains an error property
                if(response.status !== 200 || !response.json || response.json.error){
                    if(cb.failure){
                        cb.failure(response);
                    }
                }else{
                    if(cb.success){
                        cb.success(response);
                    }
                }
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
        // tabData contains the url, desciption and hash_id
        // of the tab in consideration
        bmark: function(tabData, callbacks, bind_scope) {
            var api_url_append = "/bmark/" + tabData.hash_id;
            _api.get(api_url_append, {
                    url: tabData.url,
                    description: tabData.description
                },
                callbacks,
                bind_scope);
        },
        remove: function(hash_id, callbacks, bind_scope) {
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
        },

        /**
         * Helper for updating the bmark hash list periodically.
         * Based on the params below it syncs the bmark list in localStorage
         *
         * @method checkNew
         * @param {Integer} lastSync Last Synced timestamp
         * @param {Boolean} savedPrefs Do we have valid preferences on file?
         * @param {Integer} Time period to check if it has elapsed
         * @param {Object} bind_scope A scope containing the storage object
         *
         */
        checkNew: function(lastSync, savedPrefs, interval, bind_scope) {
            var timeDiff,
                staleSync;

            if (lastSync) {
                timeDiff = new Date().getTime() - lastSync;
                staleSync = timeDiff > interval;
            } else {
                staleSync = false;
            }

            if ((lastSync && staleSync) || (!lastSync && savedPrefs)) {

                this.sync({
                    success: function(resp) {
                        resp.json.hash_list.forEach(function(key) {
                            bind_scope.storage.save(key, true);
                        });

                        // Update the last sync flag here.
                        bind_scope.storage.save('lastSync', (new Date()).getTime());
                    },
                    failure: function(resp) {
                        console.log('sync fail');
                        console.log(resp.json);
                    }
                }, bind_scope);
            }
        }
    };

    return calls;
};
