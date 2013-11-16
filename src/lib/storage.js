var extStorage = require('sdk/simple-storage').storage;


// TODO quota checking so we don't blow up; 5MB limit
var Storage = function() {

    var save = function(key, data) {
        extStorage[key] = data;
    };

    var get = function(key) {
        // NOTE
        // The || [] bit is hacky; should change once we start
        // saving other things besides a url hash array.
        return extStorage[key] || [];
    };

    return {
        save: save,
        get: get
    };
};

exports.Storage = Storage;
