const express=require("express");
const dotenv=require("dotenv");
const cors=require("cors");
const app=express();
const mongoose=require("mongoose");
const routes = require("./routes")

dotenv.config();

app.use(express.json);
app.use(cors());
app.use('/', routes);


const PORT=process.env.PORT || 8000;


mongoose
.connect(process.env.MONGO_URI, {})
.then(()=>console.log("Mongodb running"))
.catch((err)=>console.log("Mongodb error:", err))




app.listen(PORT, ()=>{
console.log(`Server running on port ${PORT}`);
})