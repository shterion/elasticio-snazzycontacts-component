const config = require('./../config/config');
const cfg = config.getEnvironment();
const seed =  require('./seed/seed');
const snazzy = require('./../lib/utils/snazzy');
const getPersons = require('./../lib/triggers/getPersons');
const getOrganizations = require('./../lib/triggers/getOrganizations');

describe('Test triggers', () => {
  test('should get cookie from the session', async () => {
    const cookie = await getPersons.session(seed.configOptions);
    expect(cookie).toHaveLength(32);
  });

  test('should get a token', async () => {
    const token = await snazzy.getToken(seed.configOptions);
    expect(token).toHaveLength(32);
  });

  test('should get all persons', async () => {
    const cookie = await getPersons.session(seed.configOptions);
    seed.options.uri =`${cfg.path}/mp_contact/json_respond/address_contactperson/json_mainview?&mp_cookie=${cookie}`;
    const persons = await getPersons.getPersons(seed.options);
    expect(persons).toHaveLength(100);
  });

  test('should get all organizations', async () => {
    const cookie = await getOrganizations.session(seed.configOptions);
    seed.options.uri =`${cfg.path}/mp_contact/json_respond/address_company/json_mainview?&mp_cookie=${cookie}`;
    const organizations = await getOrganizations.getOrganizations(seed.options);
    expect(organizations).toHaveLength(6);
  });
});
