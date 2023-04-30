const express = require("express"),
      bodyParser = require("body-parser"), 
      port = process.env.PORT || 3000;
      ejs = require("ejs");
      jsdom = require("jsdom");
      dom = new jsdom.JSDOM('');
      jquery = require('jquery')(dom.window);
      mongoose = require('mongoose'); 
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", 'ejs');
app.use(express.static('public'));

mongoose.connect("mongodb+srv://geniusjoelraj:wisegen05@cluster0.btn0y9w.mongodb.net/todolistDB?retryWrites=true&w=majority")

const itemsSchema = {
  name: String,
  checked: Boolean
}

const Item = mongoose.model('item', itemsSchema);

const item1 = new Item({
  name: 'Welcome to your todolist!',
  checked: false
});

const item2 = new Item({
  name: "Click on the delete icon to delete an item.",
  checked: true
});

const defaultItems = [item1, item2];

let listItems = [];

async function getItems() {
  listItems = [];
  try {
    mongoItems = await Item.find({});
    if (mongoItems.length === 0) {
      Item.insertMany(defaultItems);
    }
    mongoItems.forEach(function(item){
      listItems.push(item);
    });
    return listItems;
  } catch(err) {
    console.log(err.message);
  }
}


app.get("/", function(req, res) {
  res.redirect("/myday");
});

app.get("/myday", async function(req, res) {
  const curDate = new Date();
  date = curDate.toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric"});
  let listItems = await getItems(); 
  await res.render("list", {value: "My Day", date: date, tasks: listItems});
});


app.post("/myday", function(req,res) {
  const item = req.body.newTask;
  const newItem = new Item({
    name: item,
    checked: false
  });
  newItem.save();
  res.redirect("/myday");
});

app.post("/check", async function(req,res) {
  const id = req.body.checkbox;
  const cd = req.body.checkbox_hidden;
  if (id == undefined) {
    await Item.updateOne({'_id': cd}, {$set: {'checked': false}});
  } else {
    await Item.updateOne({'_id': cd}, {$set: {'checked': true}});
  }
  res.redirect('/myday');
  // const name = await Item.find({'_id': id});
  // console.log(name);
});

app.post("/delete", function(req, res) {
  console.log('delete');
  // const id = req.body.delete;
  // console.log(id);
  // res.redirect('/myday');
});

// app.get("/work", function(req, res) {
//   res.render("list", {value: "Work", tasks: workTasks});
// });

// app.post("/work", function(req,res) {
//   item = req.body.newTask;
//   workTasks.push(item);
//   res.redirect("/work");
// });

// app.get("/tasks", function(req, res) {
//   res.render("list", {value: "Tasks", tasks: tasksTasks});
// });

// app.post("/tasks", function(req,res) {
//   item = req.body.newTask;
//   tasksTasks.push(item);
//   res.redirect("/tasks");
// });


app.listen(port, function() {
  console.log("Server running on port "+port);
});

