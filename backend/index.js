//Dependencies
const express = require("express");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 3000; 



//Initializing server
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
})

