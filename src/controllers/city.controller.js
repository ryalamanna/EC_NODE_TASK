import mongoose from 'mongoose';
import City from '../models/city.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asynchandler.js';
import ApiError from '../utils/apiError.js';

export const addNewCity = asyncHandler(async (req, res) => {
    const { name, population, country, latitude, longitude } = req.body;
    const newCity = new City({
        name,
        population,
        country,
        latitude,
        longitude,
    });
    const addedCity = await newCity.save();
    return res.send(new ApiResponse(200, addedCity, 'City added successfully'));
});

export const updateCity = asyncHandler(async (req, res) => {
    const { name, population, country, latitude, longitude, _id } = req.body;
    await City.findByIdAndUpdate(_id, {
        name,
        population,
        country,
        latitude,
        longitude,
    });
    const updatedCity = await City.findById(_id);
    return res.send(
        new ApiResponse(200, updatedCity, 'City updated successfully')
    );
});

export const deleteCity = asyncHandler(async (req, res) => {
    const { _id, name } = req.query;
    let option = {};
    if (_id) {
        option._id = new mongoose.Types.ObjectId(_id);
    } else if (name) {
        option.name = name;
    }
    const deleteResponse = await City.deleteOne(option);
    const deleteCount = deleteResponse.deletedCount;

    if (deleteCount > 0) {
        return res.send(
            new ApiResponse(200, {}, `Deleted ${deleteCount} Cities`)
        );
    } else {
        throw new ApiError(400, 'City not found');
    }
});

export const getCities = asyncHandler(async (req, res) => {
    let commonAggregate = [];
    let options = {};

    //Search
    // "Search" query parameter is expected to be string
    const searchTerm = req.query.search;
    if (searchTerm) {
        commonAggregate.push({
            $match: {
                $or: [
                    {
                        $expr: {
                            $regexMatch: {
                                input: { $toLower: '$name' },
                                regex: searchTerm,
                            },
                        },
                    },
                    {
                        $expr: {
                            $regexMatch: {
                                input: { $toLower: '$country' },
                                regex: searchTerm,
                            },
                        },
                    },
                ],
            },
        });
    }

    // Filter
    // "filter" query parameter is expected to be JSON
    // example : {"name" : "udupi"}
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    if (filter) {
        if (filter._id)
            options._id = { $eq: new mongoose.Types.ObjectId(filter._id) };
        if (filter.name) {
            commonAggregate.push({
                $match: {
                    $expr: {
                        $eq: [{ $toLower: '$name' }, filter.name.toLowerCase()],
                    },
                },
            });
        }
        if (filter.country) {
            commonAggregate.push({
                $match: {
                    $expr: {
                        $eq: [
                            { $toLower: '$country' },
                            filter.country.toLowerCase(),
                        ],
                    },
                },
            });
        }
        if (filter.population) options.population = Number(filter.population);
        if (filter.latitude) options.latitude = Number(filter.latitude);
        if (filter.longitude) options.longitude = Number(filter.longitude);
    }

    commonAggregate.push({ $match: options });

    //Project
    //"project" query parameter is expected to be JSON
    // example : {"name" : 1 , "country" : 1}
    const project = req.query.project ? JSON.parse(req.query.project) : {};
    if (Object.keys(project).length) {
        commonAggregate.push({
            $project: project,
        });
    }

    //pagination
    // "limit" query parameter is expected to be Number
    // "page" query parameter is expected to be Number
    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    commonAggregate.push({ $skip: skip });
    commonAggregate.push({ $limit: limit });

    //sort
    // "sort" query parameter is expected to be JSON
    // Example : {"name": 1 , "country": -1}
    const sort = req.query.sort ? JSON.parse(req.query.sort) : {};
    if (Object.keys(sort).length) {
        commonAggregate.push({ $sort: sort });
    }

    const cities = await City.aggregate(commonAggregate);
    const totalCount = await City.countDocuments(options);

    return res.send(
        new ApiResponse(200, {
            cities,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
        })
    );
});
