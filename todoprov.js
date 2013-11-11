var Db = require ('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID

todoprov = function(host, port) {
    this.db = new Db('node-mongo-todo', new Server (host, port, {safe: false}, {auto_reconnect: true},{}));
    this.db.open (function(){});
};

todoprov.prototype.getCollection= function(callback) {
    this.db.collection('todos', function (error, todo_collection){
        if ( error) callback(error);
        else callback(null, todo_collection);
        });
};

//find the todo list
todoprov.prototype.findAll = function(callback) {
    this.getCollection(function(error, todo_collection){
        if ( error ) callback (error)
        else {
            todo_collection.find().toArray(function(error, results){
                if ( error ) callback(error)
                else callback(null, results)
            });
        }
    });
};

//Save the todo list
todoprov.prototype.save = function(todo, callback) {
    this.getCollection(function(error, todo_collection){
        if ( error ) callback(error)
        else{
            if( typeof(todo.length)=="undefined")
              todo = [todo];
              
            for (var i =0;i<todo.length;i++) {
                todo = todo[i];
                todo.created_at = new Date();
            }
            
            todo_collection.insert(todo, function() {
                callback(null, todo);
            });
        }
    });
};

//Find a task by ID
todoprov.prototype.findById = function(id, callback) {
    this.getCollection(function(error, todo_collection){
        if ( error ) callback(error)
        else
         todo_collection.findOne({_id: todo_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if ( error ) callback(error)
          else callback(null, result)
         });
        }
    );
};

//update a task
todoprov.prototype.update = function(todoId, todos, callback) {
    this.getCollection(function(error, todo_collection) {
        if( error ) callback(error);
        else {
            todo_collection.update(
                {_id: todo_collection.db.bson_serializer.ObjectID.createFromHexString(todoId)},
                todos,
                function (error, todos) {
                          if (error) callback(error);
                          else callback(null, todos)
                          });
                }
    });
};

//Delete a task
todoprov.prototype.delete = function(todoId, callback) {
    this.getCollection(function(error, todo_collection) {
        if(error) callback(error);
        else {
                todo_collection.remove(
                    {_id: todo_collection.db.bson_serializer.ObjectID.createFromHexString(todoId)},
                    function(error, todo){
                            if(error) callback(error);
                            else callback(null, todo)
                        });
                    }
        });
};

exports.todoprov = todoprov;

