const request = require('request-promise');

async function createSession(cfg) {
    const config = {
        apikey: cfg.apikey,
        email: cfg.email,
        password: cfg.password,
        path: cfg.path
    };
    console.log(`API KEY: ${config.apikey}`);
    try {
      const token = await getToken(config);

      return new Promise(async (resolve, reject) => {
        const cookie = await getCookie(token, config);
        resolve(cookie);
        reject('No cookie found!');
      });
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }
}

async function getToken(cfg) {
  const getTokenOptions = {
    uri: `${cfg.path}/mp_base/json_login/login/get_token`,
    headers: {
      'X-API-KEY': cfg.apikey
    }
  };

  try {
    const tokenRequest = await request.post(getTokenOptions);
    const tokenObject = JSON.parse(tokenRequest);
    const { token } = tokenObject.content;
    console.log(`Token: ${token}`);
    return token;
  } catch (e) {
    console.log(`ERROR: ${e}`);
  }
}

async function getCookie(token, config) {
  const options = {
    uri: `${config.path}/mp_base/json_login/login/verify_credentials`,
    json: {
      token,
      email: config.email,
      password: config.password
    },
    headers: {
      'X-API-KEY': config.apikey
    }
  };

  try {
    const cookie = await request.post(options);
    config.mp_cookie = cookie.content.mp_cookie;
    console.log(`Cookie: ${config.mp_cookie}`);
    return cookie.content.mp_cookie;
  } catch (e) {
    console.log(`ERROR: ${e}`);
  }
}

module.exports = {
  createSession,
  getToken,
  getCookie
};
