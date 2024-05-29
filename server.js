const express = require("express");
const errorHandler = require("./middleware/errorHandle");
const connectDb = require("./config/dbConnection");
const dotenv=require("dotenv").config();

connectDb();
const app=express();
app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

const port= process.env.PORT||5000;
app.listen(port,()=>{
    console.log(`servevr running on port ${port}`);
})
