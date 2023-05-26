const express = require("express"),
      bodyParser = require("body-parser"), 
      port = process.env.PORT || 3000;
      ejs = require("ejs");
      mongoose = require('mongoose'); 
      _ = require('lodash');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", 'ejs');
app.use(express.static('public'));

mongoose.connect("mongodb+srv://geniusjoelraj:wisegen05@cluster0.btn0y9w.mongodb.net/todolistDB?retryWrites=true&w=majority")

const itemsSchema = {
  name: String,
  checked: Boolean
}
const listSchema = {
  name: String,
  list: [itemsSchema] // listsSchema has a field which links it to the itemsSchema model.
}

const Item = mongoose.model('item', itemsSchema);
const List = mongoose.model('list', listSchema);

// Default items
const item1 = new Item ({
  name: 'Welcome to your todolist!',
  checked: false
});
const item2 = new Item({
  name: "Click on the delete icon to delete an item.",
  checked: false
});

const defaultItems = [item1, item2];

let lists = [];
async function getLists(listTitle) {
  try{
    lists = await List.findOne({name: listTitle});
    if (lists === null || lists === undefined) {
      List.insertMany({
        name: listTitle,
        list: defaultItems
      });
      lists = await List.findOne({name: listTitle});
      return lists.list;
    }
    return lists.list;
  } catch(err) {
    console.log(err.message);
  }
}

// Redirecting to myday.
app.get("/", function(req, res) {
  res.redirect("/my day");
});

let listName = '';
let listTitle = '';
app.get('/:ListName', async function(req, res) {
  const curDate = new Date();
  listName = req.params.ListName;
  listTitle = _.startCase(listName);
  date = curDate.toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric"});
  const lists = await getLists(listTitle);
  // lists has the list which has all the tasks and checked status.
  res.render("list", {value: listTitle, action: listName, date: date, lists: lists});
});

app.post("/check", async function(req,res) {
  const id = req.body.checkbox;
  const cd = req.body.checkbox_hidden;
  const action = req.body.action;
  const name = req.body.name;
  if (id == undefined) {
    await List.updateOne({name: name, 'list._id': cd}, {$set: {'list.$.checked': false}});
  } else {
    await List.updateOne({name: name, 'list._id': cd}, {$set: {'list.$.checked': true}});
  }
  res.redirect('/'+action);
});

app.post("/delete", async function(req, res) {
  const id = req.body.delete;
  const action = req.body.listName;
  listTitle = _.startCase(action);
  await List.findOneAndUpdate({name: listTitle}, {$pull: {list: {_id: id}}});
  res.redirect('/'+action);
}); 

app.post("/:ListName", async function(req,res) {
  listName = req.params.ListName;
  listTitle = _.startCase(listName);
  const item = req.body.newTask;
  const newItem = new Item({
    name: item,
    checked: false
  });
  await List.findOneAndUpdate({name: listTitle}, {$push: {list: newItem}})
  res.redirect("/"+listName);
});

app.listen(port, function() {
  console.log("Server running on port "+port);
});