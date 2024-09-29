import dotenv from 'dotenv'
dotenv.config();
import City from './src/models/city.model.js'
import mongoose from 'mongoose';

const dbUri = process.env.DB_URL; 

const dummyCities = [
    {
      name: "Udupi",
      population: 320000,
      country: "India",
      latitude: 55269455,
      longitude: 99666455,
    },
    {
      name: "mangalore",
      population: 620000,
      country: "India",
      latitude: 65345236,
      longitude: 933246356,
    },
    {
      name: "Kundapur",
      population: 120000,
      country: "India",
      latitude: 53455346,
      longitude: 5456234,
    },
    {
      name: "New York",
      population: 552344,
      country: "USA",
      latitude: 52342345,
      longitude: 1112334,
    },
    {
      name: "Chicago",
      population: 552344,
      country: "USA",
      latitude: 46234135,
      longitude: 77345345,
      __v: 0
    }
  ];


async function seedDatabase() {
    try {
        await mongoose.connect(dbUri, {});
        await City.deleteMany()
        const result = await City.insertMany(dummyCities);
        console.log('Dummy data inserted:', result);
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
    }
}

seedDatabase();