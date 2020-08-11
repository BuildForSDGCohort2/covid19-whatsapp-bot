const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const twilio = require("twilio");
dotenv.config();
const app = express();
const accountSid = "AC85aa1607823114fab149a3e8c26ad443";
const authToken = "f01014fa0fc7ac2723e6c81515038c07";
const client = require("twilio")(accountSid, authToken);
const MessagingResponse = require("twilio").twiml.MessagingResponse;

app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.post("/incoming", (req, res) => {
  const date = new Date().toLocaleString();
  const twiml = new MessagingResponse();
  if (
    req.body.Body.toLowerCase().trim() != "hi" &&
    req.body.Body.toLowerCase().trim() != "hello" &&
    req.body.Body.toLowerCase().trim() != "test" &&
    req.body.Body.toLowerCase().trim() != "help" &&
    req.body.Body == "undefined"
  ) {
    request(
      "https://disease.sh/v3/covid-19/countries/" + req.body.Body,
      function (error, response, body) {
        body = JSON.parse(body);
        console.log(body);

        if (body == "") {
          body = body;
        }

        const msg = twiml.message(
          body["country"] +
            "  " +
            // "(" +
            // date +
            // ")" +
            "\n\n" +
            "Cases Today : " +
            body["todayCases"] +
            "\n\n" +
            "Deaths Today : " +
            body["todayDeaths"] +
            "\n\n" +
            "Total Cases : " +
            body["cases"] +
            "\n\n" +
            "Active Cases : " +
            body["active"] +
            "\n\n" +
            "Total Deaths : " +
            body["deaths"] +
            "\n\n" +
            "Total Recovered : " +
            body["recovered"] +
            "\n\n" +
            "Total critical : " +
            body["critical"] +
            "\n\n" +
            "Total tests : " +
            body["tests"] +
            "\n\n" +
            "Created by Mulubwa Chungu" +
            "\n\n" +
            "linkedIn :https://www.linkedin.com/in/mulubwa-chungu-39748098/" +
            "\n\n" +
            "github: https://github.com/Mulubwa17"
        );
        res.writeHead(200, {
          "Content-Type": "text/xml",
        });
        res.end(twiml.toString());
      }
    );
  } else  {
    var msg = twiml.message(
      `*Hey 👋*
Seems you mistyped there,` +
        `\n\n` +
        `- Send me any country name to get its covid statistics` +
        "\n\n" +
        "Bot Created by Mulubwa Chungu" +
        "\n\n" +
        "linkedIn :https://www.linkedin.com/in/mulubwa-chungu-39748098/" +
        "\n\n" +
        "github: https://github.com/Mulubwa17"
    );
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    res.end(twiml.toString());
  }
  console.log(req.body);
});

app.post("/check", function (req, res) {
  console.log(req.body.Body);
});
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.listen(process.env.PORT, () => {
  console.log("Server is listening on Port:", process.env.PORT);
});
