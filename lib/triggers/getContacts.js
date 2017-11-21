var Q = require('q');
var elasticio = require('elasticio-node');
var messages = elasticio.messages;
var http = require('http');
var querystring = require('querystring');
var request = require('request');


exports.process = processTrigger;

function processTrigger(msg, cfg) {

  var host = "snazzycontacts.com";
  var port = 80;

  /*
    use cfg.email and cfg.password to create a session in snazzycontacts.com:
  */
  var mp_cookie = "";
  var token = "";
  var contacts = [];

  var options_getToken = {
    host: host,
    path: '/mp_base/json_login/login/get_token',
    //	port:port,
    method: 'POST',
    headers: {
      'X-API-KEY': cfg.apikey
    }
  };

  var options_getCookie = {
    host: host,
    path: '/mp_base/json_login/login/verify_credentials',
    //	port:port,
    method: 'POST',
    headers: {
      'X-API-KEY': cfg.apikey
    }
  };

  callback_getToken = function(response) {
    var str = ''
    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      //console.log(str);
      var data = JSON.parse(str);
      token = data['content']['token'];
      console.log("TOKEN: " + token);



      request.post(
        'http://snazzycontacts.com/mp_base/json_login/login/verify_credentials', {
          json: {
            token: token,
            email: cfg.email,
            password: cfg.password
          },
          headers: {
            'X-API-KEY': cfg.apikey
          }
        },
        function(error, response, body) {
          if (!error && response.statusCode == 200) {
            // console.log(body)
            mp_cookie = body['content']['mp_cookie'];
            console.log("COOKIE: " + mp_cookie);


            // post another request to get contacts:
            request.post(
              'http://snazzycontacts.com/mp_contact/json_respond/address_company/json_mainview?mp_cookie=' + mp_cookie, {
                json: {
                  max_hits: 10,
                  print_address_data_only: 1
                },
                headers: {
                  'X-API-KEY': cfg.apikey
                }
              },
              function(error, response, body) {
                if (!error && response.statusCode == 200) {
                  console.log(body)
                  contacts = body.content;

                  emitData();
                }
              }
            );
          }
        }
      );

    });
  }

  var req = http.request(options_getToken, callback_getToken);
  //This is the data we are posting, it needs to be a string or a buffer
  // req.write("hello world!");
  req.end();


  var name = cfg.email;

  var self = this;


  function emitData() {
    console.log('About to say hello to ' + name);
    /*
            var body = {
                "greeting": "Hello " + name + "!",
    	    "phone":"12345678"
            };
    */
    //         var data = messages.newMessageWithBody(body);
    var data = messages.newMessageWithBody({
      "organizations": contacts
    });

    console.log('Emitting data ' + data);

    self.emit('data', data);
  }

  function emitError(e) {
    console.log('Oops! Error occurred');

    self.emit('error', e);
  }

  function emitEnd() {
    console.log('Finished execution');

    self.emit('end');
  }

  // Q().then(emitData).fail(emitError).done(emitEnd);
}
