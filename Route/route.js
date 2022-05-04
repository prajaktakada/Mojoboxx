const express = require('express');
const router = express.Router();

 const empController=require("../Controller/empController")
//  const shortcutController = require('../Controller/shortLinkController')
 const Middleware = require('../Middleware/Auth')

  router.post('/employee',empController.createemp)
  router.post('/login',empController.login)
  router.get('/emp/:id',Middleware.Auth,empController.emp)
  router.put('/updateemp/:id',Middleware.Auth,empController.updateemp)
  router.delete('/DeleteempbyQuery/:empId',Middleware.Auth,empController.DeleteempbyQuery)

module.exports = router;


