const request = require('request');

function createSession(config, continueOnSuccess) {
    let token;
    let apiKey = config.apikey;
    let email = config.email;
    let password = config.password;
    console.log('API KEY:' + apiKey);

    request.post('https://snazzycontacts.com/mp_base/json_login/login/get_token', {
    // request.post('http://localhost/mp_base/json_login/login/get_token', {
        headers: {
          'X-API-KEY': apiKey
        }
      }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          let data = JSON.parse(body);
          token = data['content']['token'];
          console.log('Token:' + token);

          request.post('https://snazzycontacts.com/mp_base/json_login/login/verify_credentials', {
          // request.post('http://localhost/mp_base/json_login/login/verify_credentials', {
              json: {
                token: token,
                email: email,
                password: password
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
