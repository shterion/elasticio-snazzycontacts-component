const request = require('request-promise');
const _ = require('lodash')

const snazzy = require('./../actions/snazzy.js');

let cfg = {
  apikey: "acilfogux3h4xv5cilhiqskr8xo6ghhh",
  email: "syanev@wice.de",
  password: "qwerty1234",
  mp_cookie: ''
};

let user = {
  // rowid: 197411,
  // name: 'Dowey'
  // firstname: 'Patrik',
  // for_rowid: 199943,
  same_contactperson: 279,
};

snazzy.createSession(cfg, () => {
  let apiKey = cfg.apikey;
  let cookie = cfg.mp_cookie;
  let uri = `https://snazzycontacts.com/mp_contact/json_respond/address_contactperson/json_mainview?&mp_cookie=${cookie}`;

  let requestOptions = {
    json: {
      max_hits: 100,
      print_address_data_only: 1
    },
    headers: {

      'X-API-KEY': apiKey
    }
  };

  request.post(uri, requestOptions)
    .then((res) => {
        let result = res.content;
        // console.log(result);

        let same_contactperson_id = user.same_contactperson.toString();
        let matchedUsers = _.filter(result, {'same_contactperson': same_contactperson_id})
        console.log(matchedUsers);

        // let test = result.filter(({same_contactperson}) => same_contactperson = user.same_contactperson);
        // console.log(test);
        // console.log(JSON.stringify(result, undefined, 2));

    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });
});
