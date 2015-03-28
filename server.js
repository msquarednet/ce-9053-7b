var express = require("express");
var fs = require("fs");
var _ = require("underscore");

var app = express();

app.locals.pretty = true;

app.set("view engine", "jade");

var tabs = [
    {
        title: "Home",
        name: "home",
        path: ""
    },
    {
        title: "Things",
        name: "things",
        path: "things"
    },
    {
        title: "People",
        name: "people",
        path: "people"
    }
];

app.use(function(req, res, next){
   res.locals.tabs = tabs; 
   next();
});

var _data;
app.use(function(req, res, next){
    if(_data){
        res.locals.data = _data;
        return next();
    }
    fs.readFile("data/data.json", function(err, dataStream){
        console.log("reading");
        if(err)
            return next(err);
        try{
            var data = JSON.parse(dataStream.toString());
            _data = data;
            res.locals.data = data;
            next();
        }
        catch(e){
            next(e);
        }
    });
});

app.get("/", function(req, res){
   res.render("index", {selected: "home"});
});

app.get("/things", function(req, res, next){
    res.render("things/list", { things: res.locals.data.things, selected: "things"});
});

app.get("/things/:id", function(req, res){
    var thing = _.find(res.locals.data.things, function(thing){
        return thing.id == req.params.id;
    });
    res.render("things/show", { thing: thing, selected: "things"});
});

app.get("/people", function(req, res){
    res.render("people/list", { people: res.locals.data.people, selected: "people"});
});

app.get("/people/:id", function(req, res){
    var person = _.find(res.locals.data.people, function(person){
        return person.id == req.params.id;
    });
    res.render("people/show", { person: person, selected: "people"});
});

app.use(function(err, req, res, next){
   res.send(err.stack); 
});

app.listen(process.env.PORT);