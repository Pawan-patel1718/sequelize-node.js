module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        // Defile user_id if you want to change the name of the id column
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true, // If it's an auto-incrementing primary key
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
            },
        },
        profile_image: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    User.associate = function (models) {
        // associations can be defined here
        User.hasOne(models.Post, {
            foreignKey: 'user_id',
        })
        User.hasOne(models.CartItem, {
            foreignKey: "user_id"
        })
    };

    return User;
};
