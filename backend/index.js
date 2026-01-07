//Dependencies
const express = require("express");
require("dotenv").config();
const indexRoutes = require("./src/routes/indexRoutes")


const app = express();
const PORT = process.env.PORT || 3000; 


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api", indexRoutes)

//Initializing server
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
})
