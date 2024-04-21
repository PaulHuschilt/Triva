"use strict";
/*
Table of users
Table of Trivia decks

*/
const express = require("express"),
    app = express(),
    homeController = require("./controller/homeController"),
    data = require("./model/data.json")
    
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use("/public", express.static("public"))

app.get("/", homeController.renderHomePage)
app.get("/trivia/:triviaID", homeController.renderTrivia)
app.get("/trivia/data/:triviaID", (req, res) =>{
    const decks = data.decks
    console.log("Requested Deck ID: " + req.params.triviaID)
    const requestedDeck = data.decks.find((decks) =>{
        if (decks.id == req.params.triviaID){
            return true
        }
    })
    res.send(requestedDeck)
})


app.listen(app.get("port"), () => {
    console.log(`Server running on http://localhost:${app.get("port")}`);
});

