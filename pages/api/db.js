const Sequelize = require("sequelize-cockroachdb");

let sequelize = new Sequelize("Conceptua", "admin", "", {
  dialect: "postgres",
  port: 26257,
  logging: false,
});

let Keyword = sequelize.define("keyword", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: { type: Sequelize.STRING, unique: true },
  status: { type: Sequelize.INTEGER, defaultValue: 0 },
});

Keyword.sync({ force: true })
  .then(function () {
    return Keyword.bulkCreate([
      { id: 1, task: "blockchain", status: 1 },
      { id: 2, task: "machine learning", status: 0 },
    ]);
  })
  .then(function () {
    return Keyword.findAll();
  })
  .then(function (keywords) {
    keywords.forEach(function (keyword) {
      console.log(keyword.id + " " + keyword.status + " " + keyword.task);
    });
    // process.exit(0);
  })
  .catch(function (err) {
    console.error("error: " + err.message);
    process.exit(1);
  });

const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  Keyword.findAll()
    .then((data) => {
      res.render("index", { keywords: data });
    })
    .catch((err) => res.status(400).json(err));
});

app.post("/addKeyword", (req, res) => {
  const { textkeyword } = req.body;
  Keyword.create({
    task: textkeyword,
  })
    .then((_) => {
      res.redirect("/");
    })
    .catch((err) => {
      res.status(400).json({ message: "unable to create a new task" });
    });
});

app.put("/removeKeyword", (req, res) => {
  const { name, id } = req.body;
  if (name == "keyword") {
    Keyword.find({ where: { id: id } })
      .then(function (keyword) {
        return keyword.update({
          status: 1,
        });
      })
      .then(function (task) {
        console.log(id, "updated");
        res.json(task[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    Keyword.find({ where: { id: id } })
      .then(function (keyword) {
        return keyword.update({
          status: 0,
        });
      })
      .then(function (task) {
        console.log(id, "updated");
        res.json(task[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
