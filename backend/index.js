const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

require('./Models/db.js');

app.use(cors());
app.use(express.json());

// Serve uploads folder statically so images are accessible
app.use('/uploads', express.static('uploads'));

// Routers
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const boothRoutes = require("./Routes/BoothRouter");
const expoRoutes = require("./Routes/ExpoRouter");
const exhibitorRoutes = require("./Routes/ExhibitorRouter");
const scheduleRoutes = require("./Routes/ScheduleRouter");
const attendeeRouter = require('./Routes/AttendeeRouter');

app.use('/api/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use("/api/booths", boothRoutes);
app.use("/api/expos", expoRoutes); 
app.use("/api/exhibitors", exhibitorRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use('/api/attendees', attendeeRouter);

app.get('/ping', (req, res) => {
  res.send('PONG');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
