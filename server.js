const express = require('express');
const dotenv = require('dotenv').config();
const connectDb = require('./config/dbConnect');
const errorHandler = require('./middleware/errorHandler');

connectDb();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/v1/auth', require('./routes/userRoutes'));
app.use('/v1/community', require('./routes/communityRoutes'));
app.use('/v1', require('./routes/roleRoutes'));
app.use('/v1/member', require('./routes/memberRoutes'));

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));