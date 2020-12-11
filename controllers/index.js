const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ToDo, User } = require("../models");

const SALT_ROUNDS = 11;
const TOKEN_KEY = 'andrewscoolkey'


const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const password_digest = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      username,
      email,
      password_digest

    });
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(payload, TOKEN_KEY);
    return res.status(201).json({ user, token });
  } catch (error) {
    console.log("There was an error at sign up.", req.body);
    return res.status(400).json({ error: error.message });
  }
};


const signIn = async (req, res) => {
  try {
    const { loginUsername, username, loginPassword } = req.body;
    const user = await User.findOne({
      where: {
        username: loginUsername
      }
    });
    console.log('this is the user', user)
    if (await bcrypt.compare(loginPassword, user.dataValues.password_digest)) {
      const payload = {
        id: user.id,
        username: user.username,
        password: user.password
      };
      const token = jwt.sign(payload, TOKEN_KEY);
      return res.status(201).json({ user, token });
    } else {
      res.status(401).send("Username or Password is invalid- try again.");
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const password_digest = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    const updated = await User.update(
      { password_digest: password_digest },
      {
        where: { id: id }
      }
    );
    const updatedUser = await User.findOne({
      where: { id: id }
    });
    return res.json({ password: updatedUser });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const createToDo = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    const createdTodo = await ToDo.create(req.body);
    return res.status(201).json({
      createdTodo,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllToDos = async (req, res) => {
  try {
    console.log('hello getting all items')
    const ToDos = await ToDo.findAll();
    return res.status(200).json({ ToDos });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};


const getToDoById = async (req, res) => {
  try {
    console.log('i am here', req.params.id)
    const { id } = req.params;
    console.log('hello')
    const Todo = await ToDo.findOne({
      where: { id: id }
    });
    if (Todo) {
      return res.status(200).json({ Todo});
    }
    return res.status(404).send("Todo not found!");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id: id }
    });
    if (user) {
      return res.status(200).json({ user });
    }
    return res.status(404).send("User not found!");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const updateToDo = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("TODO", req.body, "id", id)
    const [updated] = await ToDo.update(req.body, {
      where: { id: id }
    });
    if (updated) {
      const updatedToDo = await ToDo.findOne({ where: { id: id } });
      return res.status(202).json({ ToDo: updatedToDo });
    }
    throw new Error("Item not found!");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteToDo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ToDo.destroy({
      where: { id: id }
    });
    if (deleted) {
      return res.status(202).send("Todo");
    }
    throw new Error("ToDos not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};


const getAllToDosbyUserId = async (req, res) => {

  const ToDos = await ToDos.findAll({
    include: [{
      model: User
    }]
  });

  console.log ('All todos associated with their respective User', JSON.stringify(ToDos, null, 4))
}



//     const items = await Item.findAll({
//       include: [{
//         model: User,
//       }]
//     });
//   } catch (error) {
//     return res.status(500).send(error.message);
//   }
// };


module.exports = {
  signUp,
  signIn,
  changePassword,
  createToDo,
  getAllToDos,
  getToDoById,
  getUserById,
  updateToDo,
  deleteToDo,
  getAllToDosbyUserId
};