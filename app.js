const express = require("express"),
      bodyParser = require("body-parser"), 
      port = process.env.PORT || 3000;
      ejs = require("ejs");
      jsdom = require("jsdom");
      dom = new jsdom.JSDOM('');
      jquery = require('jquery')(dom.window); 
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", 'ejs');

app.use(express.static('public'));

app.get("/", function(req, res) {
  res.render("list", {value: "Todo List"});
});

app.get("/myday", function(req, res) {
  res.render("list", {value: "My Day"});
});

app.get("/work", function(req, res) {
  res.render("list", {value: "Work"});
});

app.get("/tasks", function(req, res) {
  res.render("list", {value: "Tasks"});
});


app.listen(port, function() {
  console.log("Server running on port "+port);
});
