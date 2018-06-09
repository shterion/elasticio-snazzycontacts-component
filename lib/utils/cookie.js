const snazzy = require('./snazzy');

const session = async (cfg) => {
  const cookie = await snazzy.createSession(cfg);
  return cookie;
};

module.exports = { session };
