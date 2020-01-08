const express = require('express'), path = require('path');

//create our express app
const app = express();

var port = process.env.PORT || 3001;

//const axios = require('axios');

app.use('/static', express.static(path.join(__dirname, 'static-pages')))

//setup our app to use handlebars.js for templating
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// ----- setting for keyclock 

var session = require('express-session');
var Keycloak = require('keycloak-connect');

var memoryStore = new session.MemoryStore();
app.use(session({
  secret: '96d6f906-271b-4521-8975-531100c6e112',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));
var keycloak = new Keycloak({ store: memoryStore });
app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/',
  protected: '/customer'
}));

var custRouter = require('./routers/customerRouter.js');
//app.use('/', custRouter);

// --- The sequence of which to call the keycloak method is important. 

//app.use('/', keycloak.protect(), custRouter);   // This must be called first before any other Authorization enforcements.
app.use('/customer', keycloak.enforcer('ManagerResources:manage'), custRouter);
app.use('/*', keycloak.protect('realm:account-viewer'), custRouter);   // This must be called first before any other Authorization enforcements.

//have our app listen on port 3000
app.listen(port);
console.log('App is listening on port ' + port);
/*
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  next()
})
*/