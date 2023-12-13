const mongoclient = require('mongodb').MongoClient;
const ObjId = require('mongodb').ObjectId;
const url = 'mongodb+srv://admin:1234@cluster0.0jffei8.mongodb.net/?retryWrites=true&w=majority';
let mydb;
mongoclient.connect(url)
  .then(client => {
    mydb = client.db('myboard');
    // mydb.collection('post').find().toArray().then(result => {
    //   console.log(result);
    // })
    app.listen(8080, function() {
      console.log('포트 8080으로 서버 대기중...')
    });
  }).catch(err => {
    console.log(err);
  })

var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '4520',
  database: 'myboard',
});

conn.connect();



const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const db = require('node-mysql/lib/db');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.get('/', function(req, res) {
  res.render('index.ejs');
});

app.get('/list', function(req, res) {
  // conn.query('select * from post', function(err,rows, fields) {
  //   if(err) throw err;
  //   console.log(rows);
  // })
  mydb.collection('post').find().toArray().then(result => {
    console.log(result);
    res.render('list.ejs', {data: result});
  })
});

app.get('/enter', function(req, res) {
  res.render('enter.ejs')
});

app.post('/save', function(req, res) {
  console.log(req.body.title);
  console.log(req.body.content);
  console.log(req.body.someDate);
  mydb.collection('post').insertOne(
    {title: req.body.title, content: req.body.content, date: req.body.someDate}
  ).then(result => {
    console.log(result);
    console.log('데이터추가성공');
  });
  // let sql = 'insert into post (title, content, created) values(?,?,NOW())';
  // let params = [req.body.title, req.body.cotent];
  // conn.query(sql, params, function(err, result) {
  //   if(err) throw err;
  //   console.log('데이터추가성공');
  // });
  res.redirect('/list');
})

app.post('/delete', function(req, res) {
  console.log(req.body._id);
  req.body._id = new ObjId(req.body._id);
  mydb.collection('post').deleteOne(req.body)
    .then(result => {
      console.log('삭제완료');
      res.status(200).send();
    })
    .catch(err => {
      console.log(err);
      res.status(500).send();
    })
});

app.get('/content/:id', function(req, res) {
  console.log(req.params.id);
  req.params.id = new ObjId(req.params.id);
  mydb
    .collection('post')
    .findOne({_id:req.params.id})
    .then((result) => {
      console.log(result);
      res.render('content.ejs', {data: result});
    })
});

app.get('/edit/:id', function(req, res) {
  req.params.id = new ObjId(req.params.id);
  mydb
    .collection('post')
    .findOne({_id: req.params.id})
    .then((result) => {
      console.log(result);
      res.render('edit.ejs', {data: result});
    });
});

app.post('/edit', function(req, res) {
  console.log(req.body);
  req.body.id = new ObjId(req.body.id);
  mydb
    .collection('post')
    .updateOne({_id: req.body.id}, {$set: {title: req.body.title, content: req.body.content, date: req.body.someDate}})
    .then((result) => {
      console.log('수정완료');
      res.redirect('/list');
    })
    .catch((err) => {
      console.log(err);
    });
});