var express = require("express");
var path = require("path");
var fileupload = require("express-fileupload");
var mysql = require("mysql");
var nodemailer = require("nodemailer");
const req = require("express/lib/request");
const res = require("express/lib/response");
var app = express();
const port = process.env.PORT || 3000
app.use(fileupload());
app.use(express.urlencoded({ 'extended': false }));
app.use(express.static("public"));
app.listen(port, function () {
    console.log("server started");
});
var dbconfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "project",
}
let dbcon;
if (process.env.JAWSDB_URL) {
    dbcon = mysql.createConnection(process.env.JAWSDB_URL);
}
else {
    dbcon = mysql.createConnection(dbconfig);
    dbcon.connect(function (err) {
        if (err)
            console.log(err);
        else
            console.log("congratulations");
    })
}

app.get("/", function (req, resp) {
    var indexpage = path.join(process.cwd(), "public", "index.html");
    resp.sendFile(indexpage);
    console.log("indexpage opened");
})
app.post("/signupprocess", (req, resp) => {
    console.log("data page opened");
    resp.setHeader("content-type", "text/html");
    console.log(req.body);
    var dataArry = [req.body.inputemail, req.body.inputpwd, req.body.inputnumber, req.body.inputuser];
    dbcon.query("insert into users values(?,?,?,?,current_date())", dataArry, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            resp.redirect("/redirect_index.html");
            console.log("task completed");
        }
    })
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'beneficialghost18@gmail.com',
            pass: 'mannharry12@'
        }
    });
    var mailoption = {
        from: 'beneficialghost18@gmail.com',
        to: req.body.inputemail,
        subject: 'Thanks for SigningUp',
        html: '<h1>Welcome</h1>'
    }
    transporter.sendMail(mailoption, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('email sent: ' + info.response);
        }
    })
})
app.get("/fetchrecord", function (req, resp) {
    console.log(req.query.txtid)
    dbcon.query("select * from users where email=?", [req.query.txtid], function (err, result) {
        if (err) {
            resp.send(err);
        }
        else {
            resp.send(result);
        }
    })
})
app.get("/fetchlogin", function (req, resp) {
    console.log(req.query.txtemail, req.query.txtpwd)
    dbcon.query("select * from users where email=? and pwd=?", [req.query.txtemail, req.query.txtpwd], function (err, result) {
        if (err) {
            resp.send(err);
        }
        else {
            resp.send(result);
        }
    })
})
app.get("/dash-citizens", function (req, resp) {
    var profilepage = path.join(process.cwd(), "public", "dash-citizens.html");
    resp.sendFile(profilepage);
    console.log("dash opened");
});
app.get("/profile-citizens", function (req, resp) {
    var profile = path.join(process.cwd(), "public", "profile-citizens.html");
    resp.sendFile(profile);
    console.log("profilepage opened");
});
app.post("/profileprocess", function (req, resp) {
    console.log("data page opened");
    resp.setHeader("content-type", "text/html");
    var Nprofilepic = "nopic.png";
    if (req.files != null) {
        var location = path.join(process.cwd(), "public", "uploads", req.files.profilepic.name);
        Nprofilepic = req.files.profilepic.name;
        req.files.profilepic.mv(location, function (err) {
            if (err)
                console.log(err);
            else
                console.log("file uploaded sucessfully");
        })
    }
    else {
    }
    console.log(req.body);
    var dataArry = [req.body.txtEmail, req.body.inputName, req.body.inputNumber, req.body.inputAddress, req.body.inputCity,
    req.body.inputState, req.body.inputZip, Nprofilepic];
    dbcon.query("insert into profilecitizens values(?,?,?,?,?,?,?,?,current_date())", dataArry, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("task completed");
            resp.redirect("/redirect_profilepage.html");
        }
    })
})
app.post("/updateprocess", (req, resp) => {
    console.log("data page opened");
    resp.setHeader("content-type", "text/html");
    var Nprofilepic;
    if (req.files != null) {
        var location = path.join(process.cwd(), "public", "uploads", req.files.profilepic.name);
        Nprofilepic = req.files.profilepic.name;
        req.files.profilepic.mv(location, function (err) {
            if (err)
                console.log(err);
            else
                console.log("file uploaded sucessfully");
        })
    }
    else {
        Nprofilepic = req.body.jasoos;
    }
    console.log(req.body);
    var dataArry = [req.body.inputName, req.body.inputNumber, req.body.inputAddress, req.body.inputCity,
    req.body.inputState, req.body.inputZip, Nprofilepic, req.body.txtEmail];
    //use col. names in update query
    dbcon.query("update profilecitizens set name=?,number=?,address=?,city=?,state=?,zip=?,profilepic=? where email=?", dataArry, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("update completed");
            resp.redirect("/redirect_profilepage.html")
        }
    })
});
app.get("/fetchArecord", (req, resp) => {
    console.log(req.query.txtid);
    dbcon.query("select * from profilecitizens where email=?", [req.query.txtid], (err, result) => {
        if (err) {
            resp.send(err);
        }
        else
            resp.send(result);
    })
})
app.post("/postprocess", function (req, resp) {
    console.log("post page opened");
    resp.setHeader("content-type", "text/html");
    console.log(req.body);
    var dataArry = [0, req.body.txtEmail, req.body.inputcate, req.body.inputwhat, req.body.inputCity, req.body.inputdate];
    dbcon.query("insert into requests values(?,?,?,?,?,?,current_date())", dataArry, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("task completed");
            resp.redirect("/redirect_post.html");
        }
    })
})
app.post("/settingprocess", function (req, resp) {
    console.log(req.body);
    dbcon.query("update users set pwd=? where email=?", [req.body.newpwd, req.body.txtEmail], function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("task completed");
            resp.redirect("/redirect_settings.html");
        }
    });
})
app.get("/getemail", function (req, resp) {
    console.log(req.query.txtemail, req.query.txtpwd)
    dbcon.query("select * from users where email=? and pwd=?", [req.query.txtemail, req.query.txtpwd], function (err, result) {
        if (err) {
            resp.send(err);
        }
        else {
            resp.send(result);
        }
    })
})
app.get("/showAll", (req, resp) => {
    dbcon.query("select * from profilecitizens where state=?", [req.query.x], (err, result) => {
        if (err)
            resp.send(err);
        else
            resp.send(result); //it send JSON Array
    })
});
app.get("/deleteprofile", (req, resp) => {
    dbcon.query("delete from profilecitizens where email=?", [req.query.x], (err, result) => {

        if (err)
            resp.send(err);
        else
            resp.send(result.affectedRows + " Records Deleted"); //it send JSON Array
    })
});
app.get("/fetchstate", (req, resp) => {

    dbcon.query("select distinct state from profilecitizens", (err, result) => {
        if (err)
            resp.send(err);
        else
            resp.send(result); //it send JSON Array
    })
})
app.get("/dashworker", function (req, resp) {
    var profile = path.join(process.cwd(), "public", "dash-worker.html");
    resp.sendFile(profile);
    console.log("worker profilepage opened");
});
app.get("/profile-workers", function (req, resp) {
    var profile = path.join(process.cwd(), "public", "workerProfile.html");
    resp.sendFile(profile);
    console.log("worker profilepage opened");
});
app.post("/workerprocess", function (req, resp) {
    console.log("data page opened");
    resp.setHeader("content-type", "text/html");
    var Nprofilepic = "nopic.png";
    var Nidproof = "nopic.png";
    if (req.files != null) {
        var location = path.join(process.cwd(), "public", "uploads", req.files.profilepic.name);
        var destination = path.join(process.cwd(), "public", "uploads", req.files.idproof.name);
        Nprofilepic = req.files.profilepic.name;
        Nidproof = req.files.idproof.name;
        req.files.profilepic.mv(location, function (err) {
            if (err)
                console.log(err);
            else
                console.log("file uploaded sucessfully");
        })
        req.files.idproof.mv(destination, function (err) {
            if (err)
                console.log(err);
            else
                console.log("file uploaded sucessfully");
        })
    }
    console.log(req.body);
    var dataArry = [req.body.txtEmail, req.body.inputName, req.body.inputNumber, req.body.inputState, req.body.inputAddress,
    req.body.inputCity, req.body.inputcate, req.body.inputExp, req.body.inputFirm, req.body.inputwhat, Nprofilepic, Nidproof];
    dbcon.query("insert into profileworkers values(?,?,?,?,?,?,?,?,?,?,?,?,current_date())", dataArry, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("task completed");
            //resp.redirect("/redirect_profilepage.html");
        }
    })
})
app.get("/workerfinder", function (req, resp) {
    var profile = path.join(process.cwd(), "public", "workerfinder.html");
    resp.sendFile(profile);
    console.log("worker profilepage opened");
});
app.get("/fetchCities", (req, resp) => {

    dbcon.query("select distinct city from profileworkers", (err, result) => {
        if (err)
            resp.send(err);
        else
            resp.send(result); //it send JSON Array
    })
})
app.get("/fetchCate", (req, resp) => {

    dbcon.query("select distinct category from profileworkers", (err, result) => {
        if (err)
            resp.send(err);
        else
            resp.send(result); //it send JSON Array
    })
})
app.get("/fetchdetails", (req, resp) => {
    dbcon.query("select * from profileworkers where city=? and category=?", [req.query.city, req.query.cate], (err, result) => {
        if (err)
            resp.send(err);
        else
            resp.send(result); //it send JSON Array
    })
});
app.get("/findwork", function (req, resp) {
    var profile = path.join(process.cwd(), "public", "find-work.html");
    resp.sendFile(profile);
    console.log("worker profilepage opened");
});
app.get("/fetchCitiesuser", (req, resp) => {

    dbcon.query("select distinct city from requests", (err, result) => {
        if (err)
            resp.send(err);
        else
            resp.send(result); //it send JSON Array
    })
})
app.get("/fetchCateuser", (req, resp) => {

    dbcon.query("select distinct category from requests", (err, result) => {
        if (err)
            resp.send(err);
        else
            resp.send(result); //it send JSON Array
    })
})
app.get("/getdata", (req, resp) => {
    dbcon.query("select * from requests where city=? and category=?", [req.query.city, req.query.cate], (err, result) => {
        if (err)
            resp.send(err);
        else
            resp.send(result); //it send JSON Array
    })
});
app.get("/getrecord", (req, resp) => {
    dbcon.query("select * from profilecitizens where email=?", [req.query.email], (err, result) => {
        if (err)
            resp.send(err);
        else
            resp.send(result); //it send JSON Array
    })
});