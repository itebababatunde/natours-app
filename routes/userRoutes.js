
express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();


router.post('/signup', authController.signUp )
router.post('/login', authController.logIn )
router.post('/forgotPassword', authController.forgotPasword )
router.patch('/resetPassword/:token', authController.resetPassword)

//Protect all upcoming routes
router.use(authController.protect)

router.patch('/updateMyPassword', authController.protect, authController.updatePassword)
router.patch('/updateMe', userController.updateMe)
router.delete('/deleteMe', userController.deleteMe)

router.get('/me', userController.getMe, userController.getUser)


router.use(authController.restrictTo('admin'))
router.route("/")
    .get(userController.getAllUsers)
    .post(userController.createUser)
    
router.route("/:id")
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteMe);


module.exports = router;