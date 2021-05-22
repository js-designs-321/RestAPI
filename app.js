const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

// Route targeting All Articles

app.route("/articles")
  .get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    })
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })
    newArticle.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully added a new article to database.");
      }
    })
  })
  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted all articles")
      }
    })
  })

// Route targeting specific articles

app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (err) {
        res.send(err);
      } else if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No matching article is found.");
      }
    })
  })
  .put(function(req, res) {
    Article.update({
      title: req.params.articleTitle
    }, {
      title: req.body.title,
      content: req.body.content
    }, {
      overwrite: true
    }, function(err, result) {
      if (err) {
        res.send(err);
      } else if (result) {
        res.send("Successfully updated !!");
      } else {
        res.send("No such article found")
      }
    })
  })
  .patch(function(req,res){
    Article.update({
      title: req.params.articleTitle
    },{
      $set: req.body
    },function(err){
      if(err){
        res.send(err);
      }else{
        res.send("Successfully updated !!");
      }
    })
  })
  .delete(function(req,res){
    Article.deleteOne({
      title:req.params.articleTitle
    },function(err){
      if(err){
        res.send(err);
      }else{
        res.send("Successfully deleted "+req.params.articleTitle+".");
      }
    });
  });

const port = 3000;
app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is up and running on port: ", port);
  }
})
