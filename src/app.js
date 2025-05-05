    const express = require("express");
    const app = express();

    app.use("/get",(req,res)=>{
        res.send("Api response")
    })

    app.use("/post",(req,res)=>{
        res.send("aapi response")
    })
    app.use((req,res)=>{
        res.send("aaaaapppiii response")
    })
    app.use("/got",(req,res)=>{
        res.send(" response")
    })

    app.listen(8080,()=>{
        console.log("Listening to port 8080!!!!");
    })