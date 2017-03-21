var express = require('express');
var router = express.Router();

//主頁
router.get('/', function(req, res, next) {
    var db = req.con;
    var data = "";
    var userId = req.query.userId;

    var filter = "";
    if (userId) {
        filter = 'WHERE userId = ?';
    }

    var sql = "SELECT seqNo,userId,cKind,contact,remark,DATE_FORMAT(modifyTime, '%Y-%m-%d %H:%i:%S') as ModifyTime,ModifyEmp " +
              "  FROM JBContact " + filter;
    db.query(sql, userId, function(err, rows) {
        if (err) {
            console.log(err);
        }
        var data = rows;

        res.render('index', { title: '帳號清單', data: data, userId: userId });
    });
});

//新增帳號-1
router.get('/add', function(req, res, next) {

    // use userAdd.ejs
    res.render('userAdd', { title: '新增帳號'});
});

//新增帳號-2
router.post('/userAdd', function(req, res, next) {

    var db = req.con;

    var sql = {
        userId: req.body.userId,
        cKind: req.body.cKind,
        contact: req.body.contact,
        remark: req.body.remark,
        modifyTime: new Date(),
        modifyEmp: 'J1040083'
    };

    //console.log(sql);
    var qur = db.query('INSERT INTO JBContact SET ?', sql, function(err, rows) {
        if (err) {
            console.log(err);
        }
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/');
    });

});

//修改帳號-1 : 查詢明細
router.get('/userEdit', function(req, res, next) {
    var seqNo = req.query.seqNo;
    var db = req.con;
    var data = "";

    db.query('SELECT * FROM JBContact WHERE seqNo = ?', seqNo, function(err, rows) {
        if (err) {
            console.log(err);
        }

        var data = rows;
        res.render('userEdit', { title: '帳號編輯', data: data });
    });

});

//修改帳號-2
router.post('/userEdit', function(req, res, next) {
    var db = req.con;
    var seqNo = req.body.seqNo;

    var sql = {
        userId: req.body.userId,
        cKind: req.body.cKind,
        contact: req.body.contact,
        remark: req.body.remark,
        modifyTime: new Date(),
        modifyEmp: 'J1040083'
    };

    var qur = db.query('UPDATE JBContact SET ? WHERE seqNo = ?', [sql, seqNo], function(err, rows) {
        if (err) {
            console.log(err);
        }

        res.setHeader('Content-Type', 'application/json');
        res.redirect('/');
    });

});

//刪除帳號
router.get('/userDelete', function(req, res, next) {
    var seqNo = req.query.seqNo;
    var db = req.con;

    var qur = db.query('DELETE FROM JBContact WHERE seqNo = ?', seqNo, function(err, rows) {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

module.exports = router;