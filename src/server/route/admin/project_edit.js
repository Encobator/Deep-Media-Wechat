module.exports = function (req, res, callback) {
    var User = require("../../api/user.js");
    var Project = require("../../api/project.js");
    User.verify(req, res, function () {
        callback({});
    });
}
