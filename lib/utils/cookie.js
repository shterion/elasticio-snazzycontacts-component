const snazzy = require('./snazzy');

const session = async (cfg) => {
  try {
    const cookie = await snazzy.createSession(cfg);
    return cookie;
  } catch (e) {
    console.log(`ERROR: ${e}`);
  }
};

module.exports = { session };
