import { Router } from 'express';
import { addNewCity, deleteCity, getCities, updateCity } from '../controllers/city.controller.js';

export const cityRouter = Router();

cityRouter.post('/', addNewCity);
cityRouter.put('/', updateCity);
cityRouter.delete('/', deleteCity);
cityRouter.get('/', getCities);