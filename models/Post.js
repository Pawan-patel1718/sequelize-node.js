module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true, // If it's an auto-incrementing primary key
        },
        postName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_image: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                const raw_urls = this.getDataValue('post_image').split(',');
                const imageUrls = raw_urls.map(url => `${process.env.baseUrl}${url}`);
                return imageUrls;
            }
        }
    })

    Post.associate = function (models) {
        // associations can be defined here
        Post.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    };
    return Post
}