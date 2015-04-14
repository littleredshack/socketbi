app.service('sessionProperties', function () {
    var session = {};

    return {
        get: function () {
            return session;
        },
        set: function(attr, value) {
            session[attr] = value;
        }
    };
});
