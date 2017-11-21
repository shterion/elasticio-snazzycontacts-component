const request = require('request');

const config = require('./../../config/config');

function createSession(config, continueOnSuccess) {
    let token;
    let apiKey = config.apikey;
    let email = config.email;
    let password = config.password;
    let path = config.path;
    console.log('API KEY:' + apiKey);

    request.post(`${path}/mp_base/json_login/login/get_token`, {
        headers: {
          'X-API-KEY': apiKey
        }
      }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          let data = JSON.parse(body);
          token = data['content']['token'];
          console.log('Token:' + token);

          request.post(`${path}/mp_base/json_login/login/verify_credentials`, {
              json: {
                token,
                email,
                password
              },
              headers: {
                'X-API-KEY': apiKey
              }
            },
            function(error, response, body) {
              if (!error && response.statusCode == 200) {
                config['mp_cookie'] = body['content']['mp_cookie'];
                console.log('Cookie:' + config['mp_cookie']);
                continueOnSuccess();
              }
            }
          )
        } else if (error) {
          console.log(error);
        }
      }
    );
}
module.exports = {createSession};
