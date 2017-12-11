const request = require('request-promise');

const snazzy = require('./snazzy.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

// let users = [{
//   name: 'Gibs',
//   firstname: 'Oliver',
//   for_rowid: 194410, // 199970, 199943, 199967
//   // same_contactperson_top: 1
// }, {
//   name: 'Hobbs',
//   firstname: 'Jack',
//   for_rowid: 194411, // 199970, 199943, 199967
//   // same_contactperson_top: 1
// }, {
//   name: 'Steward',
//   firstname: 'Max',
//   for_rowid: 194412, // 199970, 199943, 199967
//   // same_contactperson_top: 1
// }];

let users = [{
    "rowid": "7887110470866",
    "name": "",
    "firstname": "",
  },
  {
    "rowid": "7859438145768",
    "firstname": "Almo GmbH",
    "name": "Herr Almo",
  },
  {
    "rowid": "7887111088580",
    "name": "Hess",
    "firstname": "Andreas"
  },
  {
    "rowid": "7887111105475",
    "name": "",
    "firstname": "Animonda Gmbh - Stefan Siegmund"
  },
  {
    "rowid": "7887111105021",
    "firstname": "Armin",
    "name": "Schönewolf"
  },
  {
    "rowid": "7887111105135",
    "firstname": "Armin Schönewolf",
    "name": ""
  },
  {
    "rowid": "7887111107561",
    "name": "Keller",
    "firstname": "Arnd"
  },
  {
    "rowid": "7887111107673",
    "firstname": "Arnd Keller",
    "name": "",
  },
  {
    "rowid": "7887111081134",
    "name": "Dotremont",
    "firstname": "Axel Dohmen"
  },
  {
    "rowid": "7887111091460",
    "firstname": "Art",
    "name": "Dohmen",
  },
  {
    "rowid": "7887111091577",
    "firstname": "Axel",
    "name": ""
  },
  {
    "rowid": "7855765165202",
    "name": "Herr Friedmann",
    "firstname": "Axos GmbH",
  },
  {
    "rowid": "7855651003959",
    "name": "Manuel",
    "rowid": "7887110510221",
    "firstname": "Bandmann",
  },
  {
    "rowid": "7859438179608",
    "firstname": "Bastian",
    "name": "Mengler",
    "firstname": "Bauer GmbH"
  },
  {
    "rowid": "7855521240266",
    "name": "",
    "firstname": "Baumeister, Heinz",
    "rowid": "7887111085121",
  },
  {
    "rowid": "7887111085247",
    "firstname": "Beat Burri",
    "name": "",
  },
   {
    "rowid": "7887111101747",
    "name": "",
    "firstname": "D. Loftus"
  },
  {
    "rowid": "7855651047757",
    "firstname": "Daniel",
    "name": "Dieter"
  }
];

let reply = {};

// let user = {
//   name: 'Steve',
//   for_rowid: 199978
// }

snazzy.createSession(cfg, () => {
  let apiKey = cfg.apikey;
  let cookie = cfg.mp_cookie;
  let path = cfg.path;

  let uri = `${path}/mp_contact/json_respond/address_contactperson/json_insert?&mp_cookie=${cookie}`;
  let sameContactUri = `${path}/mp_contact/json_respond/same_contactperson/json_insert?&mp_cookie=${cookie}`;
  let updatedUserUri = `${path}/mp_contact/json_respond/address_contactperson/json_detailview?mp_cookie=${cookie}`;

  // let requestOptions = {
  //   json: user,
  //   headers: {
  //     'X-API-KEY': apiKey
  //   }
  // };

  let user;
  let requestOptions;

  // users.forEach(function (currentUser) {
  //   user = currentUser;
  //   requestOptions = {
  //     json: user,
  //     headers: {
  //       'X-API-KEY': apiKey
  //     }
  //   };
  //   createPerson(requestOptions);
  // });

 for (var i = 0; i < users.length; i++) {
   user = users[i];
   requestOptions = {
     json: user,
     headers: {
           'X-API-KEY': apiKey
         }
   };
   createPerson(requestOptions);
 }

  function getSameContactId() {
    return new Promise((resolve, reject) => {
      request(sameContactUri, {
        headers: {
          'X-API-KEY': apiKey
        }
      }, (err, res, body) => {
        if (err) {
          reject(err);
          return;
        }

        let jsonDecode = JSON.parse(body);
        let sameContactId = jsonDecode.rowid;
        resolve(sameContactId);
        // console.log(`sameContactId: ${sameContactId}`);
      });
    });
  }

  function createPerson(requestOptions) {
    getSameContactId()
      .then((res) => {
        user.same_contactperson = res;
        console.log(`same_contactperson: ${user.same_contactperson}`);
        request.post(uri, requestOptions)
          .then((res) => {
            reply = res.content;
          }, (err) => {
            console.log(`ERROR: ${err}`);
          });
      }).catch((e) => {
        console.log(`ERROR: ${e}`);
      });
  }

  // request.post(uri, requestOptions)
  //   .then((res) => {
  //     console.log(JSON.stringify(res, undefined, 2));
  //   }, (err) => {
  //     if (err) {
  //       console.log(`ERROR: ${err}`);
  //     }
  //   });
});
