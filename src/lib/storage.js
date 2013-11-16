var extStorage = require('sdk/simple-storage').storage;


// TODO quota checking so we don't blow up; 5MB limit
var Storage = function() {

    var save = function(key, data) {
        console.log("Saving: " + key);
        extStorage[key] = data;
    };

    var get = function(key) {
        console.log('checking for key: ' + key);
        console.log('did we find it?');
        console.log(extStorage[key]);
        console.log(extStorage[key]);

        return extStorage[key];
    };

    return {
        save: save,
        get: get
    };
};

exports.Storage = Storage;
