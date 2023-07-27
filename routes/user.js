const { Router } = require('express');
const { AddUser, UpdateUser, DeleteUser, GetUsers, GetUser } = require('../controllers/user');

const router = Router();

router.post('/', AddUser);
router.put('/:id', UpdateUser);
router.delete('/:id', DeleteUser);
router.get('/', GetUsers);
router.get('/:id', GetUser);

module.exports = router;