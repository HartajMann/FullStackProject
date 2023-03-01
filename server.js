var express = require("express");
var path = require("path");
var mysql = require("mysql");
var app = express();
var fileupload = require("express-fileupload");
const req = require("express/lib/request");
const res = require("express/lib/response");
const e = require("express");
app.use(express.urlencoded({ 'extended': false }));
app.use(express.static("public"));
app.use(fileupload());
app.listen(3004, function () {
    console.log("server started");
});
var dbcon = {
    host: "localhost",
    user: "root",
    password: "",
    database: "learning",
}
var dataserver = mysql.createConnection(dbcon);
dataserver.connect(function (err) {
    if (err)
        console.log(err);
    else
        console.log("congratulations");
})
app.get("/", function (req, resp) {
    var profilepage = path.join(process.cwd(), "public", "profile_page.html");
    resp.sendFile(profilepage);
    console.log("profilepage opened");
});
app.post("/profileprocess", function (req, resp) {
    console.log("data page opened");
    resp.setHeader("content-type", "text/html");
    /*resp.write("<center><table border='1' width='500' rules='all' height='300' style='margin-top:150px;font-family:monospace;font-size:large;'><tr><th>Email<td>"+req.body.txtEmail);
    resp.write("<tr><th>Name<td>"+req.body.inputName);
    resp.write("<tr><th>Number<td>"+req.body.inputNumber);
    resp.write("<tr><th>Password<td>"+req.body.inputPassword);
    resp.write("<tr><th>Address<td>"+req.body.inputAddress);
    resp.write("<tr><th>City<td>"+req.body.inputCity);
    resp.write("<tr><th>State<td>"+req.body.inputState);
    resp.write("<tr><th>Zip<td>"+req.body.inputZip);*/
    var Nprofilepic = "nopic.png";
    var Nidpic = "nopic.png";
    if (req.files != null) {
        //resp.write("<tr><th>Profile Pic<td>"+req.files.profilepic.name);
        //resp.write("<tr><th>Id Proof<td>"+req.files.idproofpic.name);
        var location = path.join(process.cwd(), "uploads", req.files.profilepic.name);
        Nprofilepic = req.files.profilepic.name;
        req.files.profilepic.mv(location, function (err) {
            if (err)
                console.log(err);
            else
                console.log("file uploaded sucessfully");
        })
        var destination = path.join(process.cwd(), "uploads", req.files.idproofpic.name);
        Nidpic = req.files.idproofpic.name;
        req.files.idproofpic.mv(destination, function (err) {
            if (err) {
                console.log(err);
            }
            else
                console.log("Id proof uploaded sucessfully");
        });
    }
    else {
        //resp.write("<tr><th>Profile Pic<td>No profile pic uploaded");
        //resp.write("<tr><th>ID Proof<td>No ID proof uploaded");
        //resp.end();
    }
    //resp.end();
    console.log(req.body);
    var dataArry = [req.body.txtEmail, req.body.inputName, req.body.inputNumber, req.body.inputPassword, req.body.inputAddress, req.body.inputCity,
    req.body.inputState, req.body.inputZip, Nprofilepic, Nidpic];
    dataserver.query("insert into signupprofiles values(?,?,?,?,?,?,?,?,?,?,current_date())", dataArry, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("task completed");
            resp.send("task completed");
        }
    })
})
app.post("/updateprocess", (req, resp) => {
    console.log("data page opened");
    resp.setHeader("content-type", "text/html");
    var Nprofilepic = "nopic.png";
    var Nidpic = "nopic.png";
    if (req.files != null) {
        var location = path.join(process.cwd(),"public","uploads", req.files.profilepic.name);
        Nprofilepic = req.files.profilepic.name;
        req.files.profilepic.mv(location, function (err) {
            if (err)
                console.log(err);
            else
                console.log("file uploaded sucessfully");
        })
        var destination = path.join(process.cwd(),"public","uploads", req.files.idproofpic.name);
        Nidpic = req.files.idproofpic.name;
        req.files.idproofpic.mv(destination, function (err) {
            if (err) {
                console.log(err);
            }
            else
                console.log("Id proof uploaded sucessfully");
        });
    }
    else {

    }
    console.log(req.body);
    var dataArry = [req.body.inputName, req.body.inputNumber, req.body.inputPassword, req.body.inputAddress, req.body.inputCity,
    req.body.inputState, req.body.inputZip, Nprofilepic, Nidpic, req.body.txtEmail];
    //use col. names in update query
    dataserver.query("update signupprofiles set name=?,number=?,password=?,address=?,city=?,state=?,zip=?,profilepic=?,idproof=? where email=?", dataArry, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("update completed");
            resp.send("update completed");
        }
    })
});

//////////////////////////////// FOR SHOW ALL AND DLETE BUTTONS 
/*
app.post("/showAll",(req,resp)=>{

    dbcon.query("select * from profiles",(err,result)=>{

        if(err)
            resp.send(err);
            else
            resp.send(result); //it send JSON Array
    })

 });

 app.post("/deleteRecord",(req,resp)=>
 {
    dbcon.query("delete from profiles where emailid=?",[req.body.txtUid],(err,result)=>{

        if(err)
            resp.send(err);
            else
            resp.send(result.affectedRows+" Records Deleted"); //it send JSON Array
    })
 });
 */
//////////////////////////////////////////////////////
app.get("/fetchArecord",(req,resp)=>{
    console.log(req.query.txtid);
    dataserver.query("select * from signupprofiles where email=?",[req.query.txtid],(err,result)=>{
        if(err)
        {
            resp.send(err);
        }
        else
        resp.send(result);
    })
})
///////////////
/*function submitClick(event) {
            var url = "/profileData";
            //alert(url);
            document.getElementById("frm").action="/profileData"; //id="frm"
            if(flagContact==true)
                document.frm.submit();//name="frm"
                else
                {
                    alert("Invalid data");
                    event.preventDefault();//form submission cancel
                    return false;
                }
        }
$(document).ready(function () {

            //FETCH
            $("#btnFetch").click(function () {  //ajax function in background loads the page and brings the data  
                var url = "/fetchARecord?email=" + $("#txtEmail").val();
                $.get(url, function (response) 
                {
                     console.log(JSON.stringify(response));
                    $("#txtName").val(response[0].name);
                    $("#txtContact").val(response[0].contact);
                    $("#txtAddress").val(response[0].address);

                    var techString = response[0].tech.split(",");//it returns array of strings
                    //["c++","Java"]
                    // console.log(techString.length);

                    var tech=document.getElementById("tech");//list box
                    //alert(tech.length);

                    for(j=0;j<tech.length;j++)
                        {
                           tech[j].selected=false;
                        }


                    for (var i = 0; i < techString.length; i++) 
                    {
                        for(j=0;j<tech.length;j++)
                        {
                            alert(tech[j].value);
                            if(techString[i]==tech[j].value)
                              {
                                tech[j].selected=true;
                                break;
                              }
                        }
                       
                    }

                    $("#imgProfile").prop("src", "uploads/" + response[0].profilePath);
                    $("#imgProof").prop("src", "uploads/" + response[0].proofPath);
                })
            })
        })
*/
