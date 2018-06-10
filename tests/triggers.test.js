const config = require('./../config/config');
const cfg = config.getEnvironment();
const snazzy = require('./../lib/utils/snazzy');
const getPersons = require('./../lib/triggers/getPersons');
const getOrganizations = require('./../lib/triggers/getOrganizations');
const { organizations, persons, configOptions, options } = require('./seed/seed');

describe('Test triggers', () => {
  test('should get cookie from the session', async () => {
    const cookie = await getPersons.session(configOptions);
    expect(cookie).toHaveLength(32);
  });

  test('should get a token', async () => {
    const token = await snazzy.getToken(configOptions);
    expect(token).toHaveLength(32);
  });

  test('should get all persons', async () => {
    const cookie = await getPersons.session(configOptions);
    options.uri =`${cfg.path}/mp_contact/json_respond/address_contactperson/json_mainview?&mp_cookie=${cookie}`;
    const persons = await getPersons.getPersons(options);
    expect(persons).toHaveLength(100);
  });

  test('should get all organizations', async () => {
    const cookie = await getOrganizations.session(configOptions);
    options.uri =`${cfg.path}/mp_contact/json_respond/address_company/json_mainview?&mp_cookie=${cookie}`;
    const organizations = await getOrganizations.getOrganizations(options);
    expect(organizations).toHaveLength(6);
  });

  test('should get person name', async () => {
    const cookie = await getOrganizations.session(configOptions);
    options.uri =`${cfg.path}/mp_contact/json_respond/address_company/json_mainview?&mp_cookie=${cookie}`;
    const person = await getPersons.getPersons(options);
    expect(person[0].name).toEqual(person[0].name);
   });

  test('should get organization name', async () => {
    const cookie = await getOrganizations.session(configOptions);
    options.uri =`${cfg.path}/mp_contact/json_respond/address_company/json_mainview?&mp_cookie=${cookie}`;
    const organization = await getOrganizations.getOrganizations(options);
    expect(organization[0].name).toEqual(organizations[0].name);
   });
});
