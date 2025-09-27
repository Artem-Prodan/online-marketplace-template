const sequelize = require("../DB")
const { DataTypes } = require("sequelize");


const User = sequelize.define("user", {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email:{type: DataTypes.STRING, unique: true, allowNull: false},
    password:{type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const ShopCart = sequelize.define("cart", {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const CartItem = sequelize.define("cartItem", {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})


const Product = sequelize.define("product", {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    rating: {type: DataTypes.INTEGER, defaultValue: 0},
    img: {type: DataTypes.STRING, allowNull: false},
    brandId: { type: DataTypes.INTEGER },
    typeId: { type: DataTypes.INTEGER }
})

const Type = sequelize.define("type", {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{type: DataTypes.STRING, unique: true, allowNull: false},
})

const Brand = sequelize.define("brand", {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{type: DataTypes.STRING, unique: true, allowNull: false},
})

const Rating = sequelize.define("rating", {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rate:{type: DataTypes.INTEGER, allowNull: false},
})

const ProductInfo = sequelize.define("product_info", {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title:{type: DataTypes.STRING, allowNull: false},
    description:{type: DataTypes.STRING, allowNull: false},
})


const TypeBrand = sequelize.define("type_brand", {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const Order = sequelize.define("order", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: DataTypes.STRING, defaultValue: "PENDING" }, // order status
    total: { type: DataTypes.INTEGER, allowNull: false },

    paymentStatus: { type: DataTypes.STRING, defaultValue: "PENDING" }, // PENDING, SUCCESS, FAILED
    paymentMethod: { type: DataTypes.STRING, allowNull: true }, // card, paypal, etc.
    paidAt: { type: DataTypes.DATE, allowNull: true }
});


const OrderItem = sequelize.define("order_item", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false }
});


User.hasOne(ShopCart, {
    foreignKey: { name: 'userId', allowNull: false },
    onDelete: 'CASCADE',
    hooks: true
});
ShopCart.belongsTo(User, {
    foreignKey: { name: 'userId', allowNull: false },
    onDelete: 'CASCADE'
});

User.hasMany(Rating)
Rating.belongsTo(User)

ShopCart.hasMany(CartItem, {
    foreignKey: { name: 'cartId', allowNull: false },
    onDelete: 'CASCADE'
});
CartItem.belongsTo(ShopCart, {
    foreignKey: { name: 'cartId', allowNull: false },
    onDelete: 'CASCADE'
});

Type.hasMany(Product)
Product.belongsTo(Type)

Product.hasMany(Rating)
Rating.belongsTo(Product)

Product.hasMany(CartItem)
CartItem.belongsTo(Product)

Product.hasMany(ProductInfo, {as: "info"});
ProductInfo.belongsTo(Product)

Type.belongsToMany(Brand, {through: TypeBrand})
Brand.belongsToMany(Type, {through: TypeBrand})

User.hasMany(Order, {
    foreignKey: { name: 'userId', allowNull: false },
    onDelete: 'CASCADE'
});
Order.belongsTo(User, {
    foreignKey: { name: 'userId', allowNull: false },
    onDelete: 'CASCADE'
});

Order.hasMany(OrderItem, {
    as: "items",
    foreignKey: { name: 'orderId', allowNull: false },
    onDelete: 'CASCADE'
});
OrderItem.belongsTo(Order, {
    foreignKey: { name: 'orderId', allowNull: false },
    onDelete: 'CASCADE'
});

Product.hasMany(OrderItem, {
    foreignKey: { name: 'productId', allowNull: false },
    onDelete: 'CASCADE'
});
OrderItem.belongsTo(Product, {
    foreignKey: { name: 'productId', allowNull: false },
    onDelete: 'CASCADE'
});


module.exports = {
    User,
    ShopCart,
    CartItem,
    Product,
    Type,
    Brand,
    Rating,
    TypeBrand,
    ProductInfo,
    Order,
    OrderItem
}
