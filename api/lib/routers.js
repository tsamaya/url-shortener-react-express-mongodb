const apiRouter = require('express').Router();
const controller = require('./controller');

apiRouter.get('/short', controller.index);
apiRouter.post('/short', controller.post);
apiRouter.get('/short/:id', controller.get);
apiRouter.put('/short/:id', controller.put);
apiRouter.delete('/short/:id', controller.delete);

module.exports = apiRouter;
