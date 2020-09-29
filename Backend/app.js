const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const expressValidator = require('express-validator');
require('dotenv').config();


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
//app
const app = express();

//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => console.log("DB connected"));




const port = process.env.PORT || 8000;



//middleware
app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
//routes middleware
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});