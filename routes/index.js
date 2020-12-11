const { Router } = require('express')
const controllers = require('../controllers')
const router = Router()


router.get('/', (req, res) => res.send('This is root'))
router.post('/sign-up', controllers.signUp)
router.post('/sign-in', controllers.signIn)
router.get('/users/:id', controllers.getUserById)
router.post('/todos', controllers.createToDo)
router.get('/todos', controllers.getAllToDos)
router.get('/todos/:id', controllers.getToDoById)
router.put('/todos/:id', controllers.updateToDo)
router.delete('/todos/:id', controllers.deleteToDo)


module.exports = router;