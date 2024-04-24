const jsonData = require("../model/data.json")
const fs = require("fs")

const decks = jsonData.decks

exports.renderHomePage = async (req, res) => {
    try {
    //   const data = await fs.promises.readFile("./model/data.json", "utf8");
      res.render("index", { data: decks });
      console.log("\n" + decks)
    } catch (err) {
      console.error("Error reading the file:", err);
      res.status(500).send("Internal Server Error");
    }
  };
  
  exports.renderTrivia = async (req, res) => {
    const triviaId = req.params.triviaID
    console.log(triviaId)
    const requestedDeck = decks.find((decks) =>{
        if (decks.id == triviaId){
            return true
        }
    })
    res.render("trivia", {
        question: requestedDeck.questions[0].question,
        answers: requestedDeck.questions[0].answers
    })
  };