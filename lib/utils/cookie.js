const { createSession } = require('./snazzy');
 
const session = async (cfg) => {
  try {
    const cookie = await createSession(cfg);
    return cookie;
  } catch (e) {
    console.log(`ERROR: ${e}`);
    throw new Error(e);
  }
};

module.exports = { session };
