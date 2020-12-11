module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: DataTypes.STRING,
    password_digest: DataTypes.STRING,
    email: DataTypes.STRING
  },{})

  User.associate = function(models) {
    User.hasMany(models.ToDo, {
      foreignKey: 'userId'
    })
  }
  return User
}