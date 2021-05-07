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
app.get('/',function(req,res,next){
    var context = {};
    mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", 
    [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs],
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
});

app.post('/', function(req,res,next){
  
  var context = {};
    
 if(!req.body.id){
  mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", 
    [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs],
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
}
else {
  
mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.body.id], function(err, result){
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
    
    context.results = "Deleted Row";
    context.my_data = resp
    
    res.render('home',context);

    });
});
}});
  
app.post('/edit', function(req,res,next){
  
    var context = {};
    if(!req.body.name){
        mysql.pool.query('SELECT * FROM workouts WHERE id=?', [req.body.id], function(err, rows, fields){
            if(err){
            next(err);
            return;
        }
            var exercise = JSON.stringify(rows);
            var resp = JSON.parse(exercise);
            console.log(resp);
            
            
            context.my_data = resp
            
            res.render('edit',context);
    
        });
    
    } else {
    mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.body.id], function(err, result){
        if(err){
            next(err);
            return;
        }
    if(result.length == 1){
        var curVals = result[0];
        mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?", 
            [req.body.name|| curVals.name, req.body.reps|| curVals.reps, req.body.weight|| curVals.weight, req.body.date|| curVals.date, req.body.lbs|| curVals.lbs, req.body.id],
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
            
            context.results = "Updated Row";
            context.my_data = resp;
            
            res.render('home',context);
        });
    });
    
    }});
}});



  // This one is done. Code from the assignment.
app.get('/reset-table',function(req,res,next){
var context = {};
mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ 
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
    context.results = "Table reset";
    res.render('home',context);
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