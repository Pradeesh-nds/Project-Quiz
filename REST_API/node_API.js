const http = require('http');
const express = require('express')
const jwt = require('jsonwebtoken')
const sql = require('msnodesqlv8')
const cors = require('cors')

//Domain Authentication
const ActiveDirectory = require('activedirectory2')
const config = {
  url: 'ldap://nds.com',
  baseDN: 'dc=nds,dc=com',
  username: 'rpradeesh',
  password: 'RPA@nd6427'
}
const ad = new ActiveDirectory(config)



const date = require('date-and-time');
var bodyParser = require('body-parser');

const app = express();
const now = new Date();
ctime = date.format(now, 'YYYY/MM/DD HH:mm:ss');
app.use(cors());
app.use(bodyParser.json())
const connection = "server=NDSL015;Database=Quiz;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";

function adminVerify(authorizationToken) {
  const token = authorizationToken.split(' ')[1];
  const decode = jwt.verify(token, "secretkey")
  if (decode.role == 'Admin') {
    return true;
  }
  else {
    return false;
  }
}

function verifyToken(authorizationToken) {

  const auth = authorizationToken;
  if (auth == undefined) {
    return false;
  }
  else {
    const token = auth.split(' ')[1];
    if (!token) {
      return false;
    } else {
      try {
        const decode = jwt.verify(token, "secretkey")
        return true;
      }
      catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
          return false;
        }
      }
    }
  }

}

app.post('/api/dailyquiz', (req, res) => {

  if (!verifyToken(req.headers.authorization)) {
    res.status(200).json({ Authorization: false })
  }
  else {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const query = "select q.Question_ID,q.Question,\
    o1.Options as option1,o1.Option_ID as optionid1,\
    o2.Options as option2,o2.Option_ID as optionid2,\
    o3.Options as option3,o3.Option_ID as optionid3,\
    o4.Options as option4,o4.Option_ID as optionid4\
    FROM Questions q\
    left join Options o1 on q.Question_ID=o1.Question_ID and o1.Order_No=1\
    left join Options o2 on q.Question_ID=o2.Question_ID and o2.Order_No=2\
    left join Options o3 on q.Question_ID=o3.Question_ID and o3.Order_No=3\
    left join Options o4 on q.Question_ID=o4.Question_ID and o4.Order_No=4\
 \
    ORDER BY q.Question_ID";
    //  where q.Created_Time>=DATEADD(hour,-q.valid_time,GETDATE())\
    sql.query(connection, query, (err, rows) => {

      if (err) {
        res.status(200).send({ 'message1': err });

      }
      else {
        res.status(200).send({ rows });
      }
    })
  }
})



app.post('/api/authentication', (req, res) => {
  if (!verifyToken(req.headers.authorization)) {
    res.status(200).json({ Authorization: false })
  }
  if (!adminVerify(req.headers.authorization)) {
    res.status(200).json({ Admin: false })
  }
  else {
    res.status(200).json({ Admin: true })
  }
})



app.post('/api/submitanswers', (req, res) => {

  if (!verifyToken(req.headers.authorization)) {
    res.status(200).json({ message: "Unauthorized" })
  }
  else {
    var answer = req.body.answers;


    for (let i = 1; i < answer.length; i++) {
      const query = "insert into answers(Username,Question_ID,Option_Id,submited) values(?,?,?,?)";
      const values = [answer[0].submitedby, answer[i]['Question_Id'], answer[i]['Answer'], ctime]
      sql.query(connection, query, values, (err, rows) => {
        if (err) {
          res.status(200).send({ 'message': err });
        }
        else {

          if (i == answer.length - 1) {
            res.status(200).send({ 'message': 'success' });
          }
        }

      })
    }

  }

})


app.post('/api/createquestion', (req, res) => {

  if (!verifyToken(req.headers.authorization)) {
    res.status(200).json({ message: "Unauthorized" })
  }
  else {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const question = req.body.question;
    const query1 = "insert into QUESTIONS(Question,Created_Time,Valid_time,Created_By) values(?,?,?,?)";
    const values = [question.question, ctime, question.hours, question.created]

    sql.query(connection, query1, values, (err, rows) => {
      if (err) {
        res.status(200).send({ 'message': err });
      }
      else {
        var questionid;
        const selectquery = " SELECT Question_ID FROM Questions ORDER BY Question_ID DESC ";

        sql.query(connection, selectquery, values, (err, rows) => {
          if (err) {
            res.status(200).send({ 'message': err });
          }
          else {
            const option = req.body.options;
            questionid = rows[0]['Question_ID'];
            const query2 = "insert into Options(Options,Question_ID,Order_NO) values(?,?,?),(?,?,?),(?,?,?),(?,?,?)";
            const values2 = [option.option1, questionid, 1,
            option.option2, questionid, 2
              , option.option3, questionid, 3,
            option.option4, questionid, 4]
            sql.query(connection, query2, values2, (err, rows) => {
              if (err) {
                console.log(err)
              }
              else {
                res.status(200).send({ 'message': 'Successful' });
              }
            })

          }

        })

      }

    })

  }
})


app.post('/api/login', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { username, password } = req.body;
 
    ad.authenticate(username, password, function (err, auth) {
      if (err) {
        res.status(200).send({ 'error message': 'Invalid Credentials' });

      }
      else if (!auth) {
        res.status(200).send({ 'error message': 'Wrong Password' });
      }
      else {

        var user = username;
        var groupName = 'NDS-Employees-except_admins';


        ad.isUserMemberOf(user, groupName, function (err, isMember) {
          if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
            return;
          }
          if (isMember) {
            role = 'Admin'
            const key = { username: username, role: role }
            const token = jwt.sign(key, "secretkey");
            res.status(200).send({ token });

          }
          else {
            role = 'User'
            const key = { username: username, role: role }
            const token = jwt.sign(key, "secretkey");
            res.status(200).send({ token });
          }


        });

      }
    });
  
})


app.listen(5000, () => {
  console.log("server is running");
}
)
