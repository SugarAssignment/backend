const DataModel = require("../models/DataModel");
const NativeAppDataModel = require("../models/NativeAppDataModel");
const UserModel = require("../models/UserModel");

const getAllStores = async (req, res) => {
  try {
    const result = await DataModel.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $project: {
          image: 1,
          storeName: 1,
          totalCities: { $size: "$data" },
          totalOutlets: {
            $sum: {
              $map: {
                input: "$data",
                as: "city",
                in: { $size: "$$city.outlets" },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$storeName",
          result: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$result" },
      },
    ]);

    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ detail: "Error occurred." });
  }
};

const getAllCities = async (req, res) => {
  try {
    const result = await DataModel.aggregate([
      {
        $unwind: "$data",
      },
      {
        $group: {
          _id: "$data.city",
          outlets: {
            $push: "$data.outlets.outletName",
          },
        },
      },
      {
        $group: {
          _id: null,
          cities: {
            $push: {
              cityName: "$_id",
              outletNames: "$outlets",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          cities: 1,
        },
      },
    ]);

    let response = {};
    result[0].cities.forEach((city) => {
      response[city.cityName] = city.outletNames[1];
    });
    // await new Promise(resolve => setTimeout(resolve,2000))
    return res.status(200).send(result[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ detail: "Somethings wrong." });
  }
};

const getOffers = async (req, res) => {
  const city = req.query.city;
  const outlet = req.query.outlet;
  const result = await DataModel.find({
    "data.city": city,
    "data.outlets.outletName": outlet,
  }).sort({
    createdAt: -1,
  });
  if (result?.[0]) {
    const offers = result[0].data
      .filter((i) => i.city === city)?.[0]
      ?.outlets.filter((i) => i.outletName === outlet)?.[0].offers;
    return res.status(200).send(offers);
  } else {
    console.log("Outlet not found.");
  }
};

const createAppData = async (req, res) => {
  try {
    const { storeName, location, offers } = req.body;

    let doc = await NativeAppDataModel.findOne({ storeName: storeName });
    if (doc) {
      const locationIndex = await doc.data.findIndex(
        (i) => i.location === location
      );

      if (locationIndex != -1) {
        doc.data[locationIndex].offers = offers;
      } else {
        doc.data.push({ location: location, offers: offers });
      }

      await doc.save();

      return res.status(201).send(doc);
    } else {
      doc = new NativeAppDataModel({
        storeName: storeName,
        data: [
          {
            location: location,
            offers: offers,
          },
        ],
      });

      doc = await doc.save();

      return res.send(doc);
    }
  } catch (error) {
    console.log("createAppData: ", error);
    return res.status(400).send({ detail: "Error occurred." });
  }
};

const getAppData = async (req, res) => {
  try {
    const location = req.query.location;
    const data = await NativeAppDataModel.find();
    let resData = []

    for (let d in data){
      let a = data[d]
      // console.log("Data: ", a);
      for (let b in a?.data){
        let c = a?.data[b]
        if (c?.location === location){
          resData.push({
            storeName: a.storeName,
            location: location,
            data: c?.offers
          })
        }
      }
    }
  
    return res.send(resData);
  } catch (error) {
    console.log("getAppData: ", error);
    return res.status(400).send({ detail: "Error occurred." });
  }
};

const getCities = async (req, res) => {
  try {
    const doc = await UserModel.find({
      isAppUser: true,
    }).distinct("city");
    console.log(doc);
    return res.send(doc);
  } catch (error) {
    console.log("getCities: ", error);
    return res.status(400).send({ detail: "Error occurred." });
  }
};

module.exports = {
  getAllCities,
  getOffers,
  getAllStores,
  createAppData,
  getAppData,
  getCities,
};
