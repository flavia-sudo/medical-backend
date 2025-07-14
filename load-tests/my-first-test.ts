const http = require('k6/http');
const k6 = require('k6');

module.exports.options = {
    vus: 10,
    duration: '30s',
};

module.exports.default = function () {
    http.get('http://test.k6.io');
    k6.sleep(1);
};