module.exports = (sequelize, DataTypes) => {
  const ToDo = sequelize.define("ToDo", {
    title: DataTypes.STRING,
    task: DataTypes.STRING,
    userId: DataTypes.STRING
  },{})

  ToDo.associate = function(models) {
    ToDo.belongsTo(models.User, {
      foreignKey: 'userId'
    })
  }
  return ToDo
}