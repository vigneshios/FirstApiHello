var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Vehicle = require('./app/models/vehicle');

// Configure app for bodyParser()
// Let us grab data from the body of POST

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set up a server port
var port = process.env.PORT || 3000;

// Connect to database:
mongoose.connect('mongodb://localhost:27017/hello');

// Api routes:
var router = express.Router();

// Routes will all be prefixed with / api
app.use('/api',router);

//MiddleWare
  //MiddleWare can be very useful for doing validations.
	//we can log things from here or stop the request from continuing in the event
	//that the request is not safe.
	//middleware to use for all requests.
  router.use(function(req,res,next) {
    console.log('FYI ...There is some processing currently going down');
    next(); //important to call
  });



// Test Route
router.get('/', function(req, res){
  res.json({message:'Welcome to our API!'});
});


router.route('/vehicles')
  .post(function(req, res) {
    var vehicle = new Vehicle(); // new instance of a vehicle
    vehicle.make = req.body.make;
    vehicle.model = req.body.model;
    vehicle.color = req.body.color;

    vehicle.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({message: 'Vehicle was successfully manufactured'});
    });
  })

  .get(function(req, res) {
    Vehicle.find(function(err, vehicles) {
      if (err) {
        res.send(err);
      }
      res.json(vehicles);
    });
  });

router.route('/vehicle/:vehicle_id')
  .get(function(req, res) {
    Vehicle.findById(req.params.vehicle_id, function(err, vehicle) {
      if (err) {
        res.send(err);
      }
      res.json(vehicle);
    });
  });

router.route('/vehicle/make/:make')
  .get(function(req, res) {
    Vehicle.find({make:req.params.make}, function(err, vehicle) {
      if (err) {
        res.send(err);
      }
      res.json(vehicle);
    });
  });

router.route('/vehicle/color/:color')
  .get(function(req, res) {
    Vehicle.find({color:req.params.color}, function(err, vehicle) {
      if (err) {
        res.send(err);
      }
      res.json(vehicle);
    });
  });


// Fire up server
app.listen(port);

// Print friendly message to the console.
console.log('server is listening on port ' + port);
