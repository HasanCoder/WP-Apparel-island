//Importing Packages
var express = require("express");
var mongoose = require("mongoose");
var Pusher = require("pusher");

var config = require("config");
var path = require("path");
var cors = require("cors");
var userRoutes = require("./routes/user.js");
var chatRoutes = require("./routes/chat.js");
var authRoutes = require("./routes/auth.js");
var departmentRoutes = require("./routes/department.js");
var orderRoutes = require("./routes/order.js");
var forumRoutes = require("./routes/forum.js");
let AuthMiddleware = require("./middleware/AuthMiddleware");

const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1154189",
  key: "529cf8119f342b5e04b2",
  secret: "eef6b59e2f5cd4f9bb49",
  cluster: "ap2",
  useTLS: true,
});

//Middleware
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

// app.use(AuthMiddleware);

//DB

const connection_uri = config.get("mongoURI");

mongoose
  .connect(connection_uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connected to db!!");
  })
  .catch((err) => {
    console.log(`error occured in connecting to db`);
  });

const db = mongoose.connection;

db.once("open", () => {
  const chatCollection = db.collection("chats");
  const changeStream = chatCollection.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", messageDetails);
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

//routes

app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/forum", forumRoutes);

// if( process.env.Node_ENV === 'production'){

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});
// }

//listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));
