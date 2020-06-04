import express from 'express';

import PointsController from './Controllers/PointsController';
import ItemsController from './Controllers/ItemsController';

const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();

//Items
routes.get('/items', itemsController.index);

//Points
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);
routes.post('/points', pointsController.create);

export default routes;
