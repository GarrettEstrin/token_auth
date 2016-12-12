const
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  mongoose = require('mongoose'),
  dotenv = require('dotenv').load({silent: true}),

  jwt = require('jsonwebtoken'),
  User = require('./models/user.js'),
  PORT = process.env.PORT || 3000

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URL, function(err) {
  if(err) return console.log(err)
  console.log("Connected to MongoDB")
})
app.set('superSecret', process.env.secret)

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(logger('dev'));


// Routes

app.get('/', function(req, res){
  res.send('API is at http:localhost:' + PORT + '/api')
})

app.get('/setup', function(req, res) {
  console.log("Setup route hit");
  // create a sample user
  var nick = new User({
    name: 'Nick Cerminara',
    password: 'password',
    admin: true
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

app.listen(PORT, function(){
  console.log("Connected on port " + PORT);
})
