const request = require('request-promise');

function createSession(config, continueOnSuccess) {
  const {apikey} = config;
  const {email} = config;
  const {password} = config;
  const {path} = config;
  console.log(`API KEY: ${apikey}`);

  const getTokenOptions = {
    uri: `${path}/mp_base/json_login/login/get_token`,
    headers: {
      'X-API-KEY': apikey
    }
  };

  request.post(getTokenOptions)
    .then((res) => {
      const data = JSON.parse(res);
      const {token} = data.content;
      const options = {
        uri: `${path}/mp_base/json_login/login/verify_credentials`,
        json: {
          token,
          email,
          password
        },
        headers: {
          'X-API-KEY': apikey
        }
      };

      request.post(options)
        .then((res) => {
          config.mp_cookie = res.content.mp_cookie;
          console.log(`Cookie: ${config.mp_cookie}`);
          continueOnSuccess();
        }).catch((e) => {
          console.log(`ERROR: ${e}`);
        });
      console.log('Token:' + token);
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });
}
module.exports = {
  createSession
};
