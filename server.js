var express = require("express");
var bodyParser = require("body-parser");

var PORT = process.env.PORT || 3000;

var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// routes
app.get("/", function(req, res) {
    res.render("index");
})

app.listen(PORT, function () {
    console.log("App now listening at localhost: " + PORT);
}); 

//app.use(routes);
// require("./routes/html_routes")(app);
// require("./routes/api_routes")(app);


  


