const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api', (req, res) => {
  res.sendStatus(200);
});


let db = new sqlite3.Database('./data.db');
db.all('SELECT * FROM colleges', (err, rows) => {
  if (err) {
    throw err;
  }
  app.get('/api/colleges', (req, res) => {
    res.json(rows);
  });

  for (let i = 0; i < rows.length; i++) {
    let college = rows[i];

    db.all('SELECT * FROM major WHERE college = "' + college.code + '"', (err, majors) => {
      if (err) {
        throw err;
      }
      app.get('/api/major/' + college.code, (req, res) => {
        res.json(majors);
      });
    });
  }
});

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(process.env.PORT || 8080, () => console.log('Running'));
