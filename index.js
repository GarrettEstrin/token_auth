const
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  mongoose = require('mongoose'),
  dotenv = require('dotenv').load({silent: true}),

  jwt = require('jsonwebtoken'),
  User = require('./models/user.js'),
  apiRoutes = express.Router(),
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

// API ROUTES -------------------

// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)

// TODO: route middleware to verify a token

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

app.listen(PORT, function(){
  console.log("Connected on port " + PORT);
})
