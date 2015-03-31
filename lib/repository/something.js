var Q = require('q'),
    monk = require('monk');

module.exports = SomethingRepository;

function SomethingRepository() {
    this.db = monk(process.env.MONGO_URL);

    this.collection = this.db.get('somethings');
}

SomethingRepository.prototype.getAll = function() {
    var deferred = Q.defer();

    this.collection.find({}, function(e, docs) {
        if (e) {
            return deferred.reject(e);
        }

        deferred.resolve(docs);
    });

    return deferred.promise;
};


