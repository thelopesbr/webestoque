
const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const flash = require('connect-flash');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const auth = require('./middlewares/auth');

const loginRoute = require('./routes/loginRoute');
const indexRoute = require('./routes/indexRoute');
const initRoute = require('./routes/initRoute');
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const contactRoute = require('./routes/contactRoute');



const cookieSession = require('cookie-session');
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}));

app.use(flash());



app.use(bodyParser.json());
app.use(express.urlencoded({
    parameterLimit: 8000,
    extended: false
}))
app.use(express.json({ limit: '2mb' }))


app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');


app.use('/css', express.static(path.join(__dirname, '../public/css')))
app.use('/js', express.static(path.join(__dirname, '../public/js')))
app.use('/img', express.static(path.join(__dirname, '../public/img')))


app.use('/login', loginRoute);
app.use('/', indexRoute);
app.use('/state',initRoute);

app.use('/product', auth.format, productRoute);
app.use('/user',auth.format, userRoute);
app.use('/admin', auth.format, adminRoute)
app.use('/contact', contactRoute)

app.use("/files",express.static(path.resolve(__dirname, "..", "tmp", "uploads")));
app.use("/images",express.static(path.resolve(__dirname, "..", "public","img")));


app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
});