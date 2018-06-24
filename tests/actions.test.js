const config = require('./../config/config');
const cfg = config.getEnvironment();
const seed =  require('./seed/seed');
const { session } = require('./../lib/utils/cookie');
const { organizations, persons, configOptions, options } = require('./seed/seed');
const { checkForExistingUser, getSameContactId, createOrUpdatePerson } = require('./../lib/actions/createPerson');
const toBeType = require('jest-tobetype');
expect.extend(toBeType);

describe('Test actions', () => {
  test('should check for existning person', async () => {
    const cookie = await session(configOptions);
    const person = seed.persons[2];
    const existningUserRowid = await checkForExistingUser(person, cookie);
    expect(existningUserRowid).toHaveLength(6);
  });

  test('should get sameContactId', async () => {
    const cookie = await session(configOptions);
    const sameContactId = await getSameContactId(cookie);
    expect(sameContactId).toBeType('number');
    expect(sameContactId.toString()).toHaveLength(4);
  });
});
