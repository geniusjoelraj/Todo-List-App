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

let item = '';
const myDayTasks = [];
      workTasks = [];
      tasksTasks = [];

app.get("/", function(req, res) {
  res.redirect("/myday");
});

app.get("/myday", function(req, res) {
  const curDate = new Date();
  date = curDate.toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric"});
  res.render("list", {value: "My Day", date: date, tasks: myDayTasks});
});

app.post("/myday", function(req,res) {
  item = req.body.newTask;
  myDayTasks.push(item);
  res.redirect("/myday");
});

app.get("/work", function(req, res) {
  res.render("list", {value: "Work", tasks: workTasks});
});

app.post("/work", function(req,res) {
  item = req.body.newTask;
  workTasks.push(item);
  res.redirect("/work");
});

app.get("/tasks", function(req, res) {
  res.render("list", {value: "Tasks", tasks: tasksTasks});
});

app.post("/tasks", function(req,res) {
  item = req.body.newTask;
  tasksTasks.push(item);
  res.redirect("/tasks");
});


app.listen(port, function() {
  console.log("Server running on port "+port);
});
