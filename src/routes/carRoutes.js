import { Router } from 'express';
import { createCar, deleteCar, getCar, listCars, updateCar } from '../controllers/carController.js';

const router = Router();

router.route('/').get(listCars).post(createCar);
router.route('/:id').get(getCar).put(updateCar).delete(deleteCar);

export default router;
