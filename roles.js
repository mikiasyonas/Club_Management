const AccessControl = require('accesscontrol');
const ac = new AccessControl();

exports.roles = (function() {
    ac.grant("member")
        .readOwn("profile")
        .updateOwn("profile")

    ac.grant("division_president")
        .extend("member")
        .readAny("profile")

    ac.grant("president")
        .extend("member")
        .extend("division_president")
        .updateAny("profile")
        .deleteAny("profile")
    return ac;
}());