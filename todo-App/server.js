const express = require("express");
const mongodb = require("mongodb");

const myApp = express();

let db;
myApp.use(express.static("public"));

const conn =
  "mongodb+srv://rdToDoApp:stud@CE1607@cluster0-hanfw.mongodb.net/ToDoApp?retryWrites=true&w=majority";

mongodb.connect(
  conn,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    db = client.db();
    myApp.listen(3000);
  }
);

myApp.use(express.json());
myApp.use(express.urlencoded({ extended: false }));
myApp.get("/", function (req, res) {
  db.collection("items")
    .find()
    .toArray(function (err, items) {
      res.send(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Simple To-Do App</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
        </head>
        <body>
          <div class="container">
            <h1 class="display-4 text-center py-1">To-Do App</h1>
            
            <div class="jumbotron p-3 shadow-sm">
              <form action="/create-item" method="POST">
                <div class="d-flex align-items-center">
                  <input autofocus autocomplete="off" name="itemName" class="form-control mr-3" type="text" style="flex: 1;">
                  <button class="btn btn-primary">Add New Item</button>
                </div>
              </form>
            </div>            
            <ul class="list-group pb-5">
                ${items
                  .map(function (item) {
                    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                    <span class="item-text">${item.name}</span>
                    <div>
                      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
                    </div>
                  </li>`;
                  })
                  .join("")}                            
            </ul>            
          </div>
          
          <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
          <script src="/browser.js"></script>
          
        </body>
        </html>`
      );
    });
});

myApp.post("/create-item", (req, res) => {
  let itemName = req.body.itemName;
  db.collection("items").insertOne({ name: itemName });
  res.redirect("/");
});

myApp.post("/update-item", (req, res) => {
  db.collection("items").findOneAndUpdate(
    { _id: new mongodb.ObjectID(req.body.id) },
    { $set: { name: req.body.text } },
    () => {
      res.send("Success");
    }
  );
});

myApp.post("/delete-item", (req, res) => {
  db.collection("items").deleteOne(
    { _id: new mongodb.ObjectID(req.body.id) },
    () => {
      res.send("Deleted");
    }
  );
});
