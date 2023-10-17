module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define('CartItem', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cart_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, // cart_id as the primary key
            autoIncrement: true,
        },
        cartItemName: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });

    CartItem.associate = function (models) {
        // associations can be defined here
        CartItem.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE'
        });
    };

    return CartItem;
};
