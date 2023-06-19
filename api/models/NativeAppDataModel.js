const { default: mongoose } = require("mongoose");

const AppDataSchema = new mongoose.Schema(
  {
    storeName: String,
    data: [
      mongoose.Schema({
        location: String,
        offers: [
          mongoose.Schema(
            {
              detail: String,
              promoCode: {
                type: String,
                required: false,
              },
            },
            { strict: false }
          ),
        ],
      }),
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { strict: false }
);

module.exports = mongoose.model("AppData", AppDataSchema);
