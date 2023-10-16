const express = require('express');
const createUpdateController = require('../controllers/create-update.controller');
const showUpdatesController = require('../controllers/list-updates.controller');

const updatesRouter = express.Router();

updatesRouter.post('/create', createUpdateController);
updatesRouter.get('/list', showUpdatesController);

module.exports = updatesRouter;
