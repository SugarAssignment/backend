const mongoose = require("mongoose");

const DataSchema =new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  storeName: {
    type: String,
    required: false,
  },
  image: String,
  data: [
    mongoose.Schema({
      city: String,
      outlets: [
        mongoose.Schema(
          {
            offers: Object,
            outletName: String,
          },
          { strict: false }
        ),
      ],
    }),
  ],
});

const DataModel = mongoose.model("StoreData", DataSchema);

module.exports = DataModel;
