const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const Scrape = require("./Scrapers/scrape");
const helmet = require("helmet");

// const DB_URL = "mongodb://localhost:27017/sugarwallet";
const DB_URL =
  "mongodb+srv://henish9045:henish%409045@cluster0.dqyvu6w.mongodb.net/sugarwallet";

const DataModel = require("./models/DataModel");
const router = require("./routes");

mongoose.Promise = global.Promise;
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", () => {
  console.log(`unable to connect to database: ${DB_URL}`);
});

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/scrape", async (req, res) => {
  try {
    const data = await Scrape();
    const doc = await DataModel.findOne({ storeName: data?.storeName });
    if (doc) {
      doc.data = data.data;
      await doc.save();
    } else {
      await DataModel.create({
        ...data,
      });
    }
    return res.status(201).send("Data Successfully scraped.");
  } catch (error) {
    console.error(error);
    return res.status(500).send({ detail: "Error occurred." });
  }
});
app.use("/", router);

app.listen(5000, () => {
  console.log("Server listening on port 5000...");
});
