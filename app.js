//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

////////////////////////////// request targetting article ///////////////////////////////////////////////
app.route("/articles")

.get(function(req, res) {
  Article.find(function(err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      console.log(err);
    }
  });
})

.post(function(req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send("successfully added a new article");
    }
  });
})

.delete(function(req, res) {
  Article.deleteMany({}, function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send("successfully deleted all the articles.");
    }
  });
});


////////////////////////////////// request targetting specific article //////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(err){
      res.send(err);
    }else{
      res.send(foundArticle);
    }
  });
})

.put(function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {title:req.body.title, content:req.body.content},
    {overwrite:true},
    function(err){
      if(err){
        res.send(err);
      }else{
        res.send("successfully updated article.");
      }
    }
  );
})

.patch(function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err){
      if(err){
        res.send(err);
      }else{
        res.send("successfully updated the article.");
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(err){
        res.send(err);
      }else{
        res.send("successfully deleted the article.");
      }
    }
  );
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
