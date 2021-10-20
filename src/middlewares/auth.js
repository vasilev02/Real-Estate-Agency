const jwt = require('jsonwebtoken');
const { SECRET } = require('../config/config');
const { TOKEN_COOKIE_NAME } = require('../constants');

module.exports = function () {
    return (req, res, next) => {
        let token = req.cookies[TOKEN_COOKIE_NAME];
        if (token) {
            jwt.verify(token, SECRET, function (err, decoded) {
                if (err) {
                    res.clearCookie(TOKEN_COOKIE_NAME);
                } else {
                    req.user = decoded;
                    res.locals.user = decoded;
                    res.locals.isAuthenticated = true;
                }
            });
        }
        next();
    };
}