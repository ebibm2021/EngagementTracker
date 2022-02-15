require('dotenv').config();
var util = require('./util.controller');

exports.getHealth = (req, resp) => {
    return resp.status(200).send({
        info: "success",
        data: "healthy",
        message: "healthy"
    })
}
