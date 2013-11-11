
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var todoprov = require('./todoprov').todoprov;

var app = express();

// all environments
app.configure(function() {
 app.set('port', process.env.PORT || 3000);
 app.set('views', __dirname + '/views');
 app.set('view engine', 'jade');
 app.set('view options', {layout: false});
 app.use(express.favicon());
 app.use(express.logger('dev'));
 app.use(express.bodyParser());
 app.use(express.methodOverride());
 app.use(app.router);
 app.use(require('stylus').middleware(__dirname + '/public'));
 app.use(express.static(path.join(__dirname, 'public')));
});

// development only
app.configure('development', function(){
  app.use(express.errorHandler());
});

//Mongo local server
var todoprov = new todoprov ('localhost', 27017);


//Routes

app.get('/', function(req, res){
  todoprov.findAll(function(error, emps){
    res.render('index', {
      title: 'Todo List',
      todos:emps
    });
  });
});
  
app.get('/todo/new', function(req, res){
  res.render('todo_new', {
    title: 'new todo'
  });
});

//Save new todo
app.post('/todo/new', function(req, res){
  todoprov.save({
    title: req.param('title'),
    Description: req.param('Description')
  }, function( error, docs) {
    res.redirect('/')
  });
});

//update a task
app.get('/todo/:id/edit', function(req, res){
  todoprov.findById(req.param('_id'), function(error, todo) {
    res.render('todo_edit',
    {
          todo: todo
    });
  });
});

//save task update
app.post('/todo/:id/edit', function(req, res){
  todoprov.update(req.param('_id'),{
    title: req.param('title'),
    Description: req.param('Description')
  }, function(error, docs) {
    res.redirect('/')
 });
});


//delete a task
app.post('/todo/:id/delete', function(req, res) {
       todoprov.delete(req.param('_id'), function(error, docs) {
           res.redirect('/')
        });
});




//create localhost
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
//});
