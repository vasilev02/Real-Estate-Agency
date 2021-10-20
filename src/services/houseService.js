const House = require("../models/House");
const User = require("../models/User");

const getAll = () => House.find({}).lean();
const getOne = (id) => House.findById(id).lean();
const getLastThreeHouses = () =>
  House.find({}).sort({ _id: -1 }).limit(3).lean();

const searchHouses = async (query) => {
  let houses = await await House.find({}).lean();

  if (query.search) {
    houses = houses.filter((h) => h.name.toLowerCase().includes(query.search));
  }
  return houses;
};

const create = (houseData, userId) => {
  let house = new House({
    name: houseData.name,
    type: houseData.type,
    year: houseData.year,
    city: houseData.city,
    homeImage: houseData.homeImage,
    description: houseData.description,
    availablePieces: houseData.availablePieces,
    rentedHome: [],
    owner: userId,
  });

  return house.save();
};

const updateOne = async (houseId, house) =>
  House.findByIdAndUpdate(houseId, house, { runValidators: true });

const deleteOne = (houseId) => House.findByIdAndDelete(houseId);

const getNames = async (peopleIds) => {
  const people = await User.find({ '_id': { $in: peopleIds } });
  const names = people.map(person => person.name);
  return names;
};

const isRentedByCurrentUser = async (peopleIds, userId) => {
  const people = await User.find({ '_id': { $in: peopleIds } });
  const ids = people.map(person => person.id);
  const result = ids.find(currentId => currentId == userId)
  if(result){
    return true;
  }
  return false;
};

const houseService = {
  getAll,
  getOne,
  getLastThreeHouses,
  create,
  updateOne,
  deleteOne,
  searchHouses,
  getNames,
  isRentedByCurrentUser
};
module.exports = houseService;
