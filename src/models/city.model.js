import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    population: {
        type: Number,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        default: Date.now,
    }
});

const City = mongoose.model('City', citySchema);

export default City;
