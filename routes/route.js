const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const divisionController = require('../controllers/DivisionController');

  
//User Stuff
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/user/:userId', userController.allowIfLoggedin, userController.getUser);
router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);
router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);
router.delete('/user/userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);

//Division Stuff
router.post('/division',userController.allowIfLoggedin, divisionController.createDivision);
router.put('/assignPresident/:presidentId/:divisionId', userController.allowIfLoggedin, divisionController.assignPresident);
router.delete('/removePresident/:divisionId',userController.allowIfLoggedin, divisionController.removePresident);
router.put('/changeDivisionName/:divisionId', userController.allowIfLoggedin, divisionController.changeName);
router.delete('/deleteDivision/:divisionId', userController.allowIfLoggedin, divisionController.deleteDivision);
router.get('/division/members', userController.allowIfLoggedin, divisionController.getDivisionMembers);

module.exports = router;