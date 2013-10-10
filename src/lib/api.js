var Request = require("sdk/request").Request;

var Api = function(config) {
    if (!config)
        return false;

    var defaultReqParams = {'api_key': encodeURIComponent(config.api_key)};

    call = function(endpoint, params, cb) {
        let request = Request({
            url: config.api_url + endpoint,
            content: defaultReqParams,
            onComplete: function (response) {
                // TODO probably check 'error' here for generic handling
                cb(response);
            }
        });

        console.log(request.url);
        console.log(request.content);

        return request;
    };

    get = function(endpoint, params, cb) {
        call(endpoint, params, cb).get();
    };

    post = function(endpoint, params, cb) {
        call(endpoint, params, cb).post();
    };


    // expose public things
    return {
        get: get,
        post: post
    };
};

exports.Api = Api;
