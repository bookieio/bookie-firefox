var extStorage = require('sdk/simple-storage').storage;


// TODO quota checking so we don't blow up; 5MB limit
var Storage = function() {

    var save = function(key, data) {
        console.log('save it! ' + data);
        extStorage['key'] = data;
    };

    var get = function(key) {
        return extStorage[key];
    };

    return {
        save: save,
        get: get
    };
};

exports.Storage = Storage;
