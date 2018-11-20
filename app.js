const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use( async (req,res,next) => {
    try {
        const user = await User.findByPk(1)
        req.user = user
        next()
    } catch (error) {
        console.log(error);
    }
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through : CartItem })
Product.belongsToMany(Cart, { through : CartItem })
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, { through : OrderItem })

try {
    // sequelize.sync({force: true}).then(async res => {
    sequelize.sync().then(async res => {
        let user = await User.findByPk(1)
        if (!user) {
          user = await User.create({name: 'Davi', email: 'davirolim94@gmail.com'})
        }
        let cart = await user.getCart()
        if (!cart) {
            await user.createCart()
        }
        app.listen(3000)
    })
} catch (error) {
    console.log(error);
}
