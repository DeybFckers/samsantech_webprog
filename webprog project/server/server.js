const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db"); // Import database connection
const customerRoutes = require("./routes/customer"); // Import customers route
const barberRoutes = require("./routes/barber"); // Import barbers route
const servicesRoutes = require("./routes/services");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.json());

// ✅ Use customer and barber routes
app.use("/customer", customerRoutes);
app.use("/barber", barberRoutes);
app.use("/services", servicesRoutes);

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
