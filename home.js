var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

// var session = require('express-session');
var bodyParser = require('body-parser');
var request = require('request');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(session({secret:'SuperSecretPassword'}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 4845);

// This is the sample 'get' from helloMysql.js
app.get('/enter-member',function(req,res,next){
    var context = {};
    if(!req.query.id){
    mysql.pool.query("INSERT INTO Members (`firstName`, `lastName`, `email`, `birthdate`, `enrollDate`, `enroller`) VALUES (?, ?, ?, ?, ?, ?)", 
    [req.query.fname, req.query.lname, req.query.email, req.query.bdate, req.query.edate, req.query.emp],
    function(err, result){
    if(err){
        next(err);
        return;
    }
    mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
        if(err){
        next(err);
        return;
        }
        var exercise = JSON.stringify(rows);
        var resp = JSON.parse(exercise);
        console.log(resp);
        
        context.results = "Inserted ID " + result.insertId;
        context.my_data = resp;
        
        res.render('home',context);
    });
});
};
});
app.post('/enter-member', function(req,res,next){
  
  var context = {};
    
 if(!req.body.id){
  mysql.pool.query("INSERT INTO Members (`firstName`, `lastName`, `email`, `birthdate`, `enrollDate`, `enroller`) VALUES (?, ?, ?, ?, ?, ?)", 
    [req.body.fname, req.body.lname, req.body.email, req.body.bdate, req.body.edate, req.body.emp],
    function(err, result){
    if(err){
      next(err);
      return;
    }
  mysql.pool.query('SELECT * FROM Members', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    var exercise = JSON.stringify(rows);
    var resp = JSON.parse(member);
    console.log(resp);
    
    context.results = "Inserted ID " + result.insertId;
    context.my_data = resp;
    
    res.render('enterMember',context);
});
});
}
else {
  
mysql.pool.query("DELETE FROM Members WHERE id=?", [req.body.id], function(err, result){
    if(err){
    next(err);
    return;
    }
mysql.pool.query('SELECT * FROM Members', function(err, rows, fields){
    if(err){
    next(err);
    return;
}
    var exercise = JSON.stringify(rows);
    var resp = JSON.parse(member);
    console.log(resp);
    
    context.results = "Deleted Row";
    context.my_data = resp
    
    res.render('enterMembers',context);

    });
});
}});
/*  
app.post('/enter-member', function(req,res,next){
  
    var context = {};
    if(!req.body.name){
        mysql.pool.query('SELECT * FROM Members WHERE memberID=?', [req.body.id], function(err, rows, fields){
            if(err){
            next(err);
            return;
        }
            var exercise = JSON.stringify(rows);
            var resp = JSON.parse(exercise);
            console.log(resp);
            
            
            context.my_data = resp
            
            res.render('enterMember',context);
    
        });
    
    } else {
    mysql.pool.query("SELECT * FROM Members WHERE memberID=?", [req.body.id], function(err, result){
        if(err){
            next(err);
            return;
        }
    if(result.length == 1){
        var curVals = result[0];
        mysql.pool.query("UPDATE Members SET firstName=?, lastName=?, email=?, birthdate=?, enrollDate=?, enroller=? WHERE memberID=?", 
            [req.body.name|| curVals.name, req.body.reps|| curVals.reps, req.body.weight|| curVals.weight, req.body.date|| curVals.date, req.body.lbs|| curVals.lbs, req.body.id],
            function(err, result){
            if(err){
            next(err);
            return;
            }
        mysql.pool.query('SELECT * FROM Members', function(err, rows, fields){
            if(err){
            next(err);
            return;
            }
            var exercise = JSON.stringify(rows);
            var resp = JSON.parse(exercise);
            console.log(resp);
            
            context.results = "Updated Row";
            context.my_data = resp;
            
            res.render('enterMember',context);
        });
    });
    
    }});
}});
*/


  // This one is done. Code from the assignment.
app.get('/reset-table',function(req,res,next){
var context = {};
mysql.pool.query("DROP TABLE IF EXISTS Members", function(err){ 
    var createString = "CREATE TABLE Members("+
    "memberID INT PRIMARY KEY AUTO_INCREMENT,"+
    "firstName VARCHAR(255) NOT NULL,"+
    "lastName VARCHAR(255) NOT NULL,"+
    "email VARCHAR(255) NOT NULL,"+
    "birthdate DATE,"+
    "enrollDate DATE,"+
    "enroller INT)";
    mysql.pool.query(createString, function(err){
    context.results = "Table reset";
    res.render('enterMember',context);
    })
});
});

app.use(function(req,res){
res.status(404);
res.render('404');
});

app.use(function(err, req, res, next){
console.error(err.stack);
res.type('plain/text');
res.status(500);
res.render('500');
});

app.listen(app.get('port'), function(){
console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
    // }}) 