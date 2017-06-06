const login = require("facebook-chat-api");
const fs = require('fs');
const async = require('async');
const config = require('./credential.json');

// Load users form file.
var userFileData = fs.readFileSync('./userid.txt').toString();
var messageData = fs.readFileSync('./message.txt').toString();
var userList = userFileData.split('\n');
var task = [];

// Create simple echo bot
login({email: config.email, password: config.password}, (err, api) => {
    if (err) {
        console.error(err);
    } else {
        userList.forEach(function (id) {
            if (isNaN(id)) {
                // name string
                task.push(function (callback) {
                    api.getUserID(id, (err, data) => {
                        if (err) {
                            console.error(err);
                            callback(null, err);
                        } else {
                            var threadID = data[0].userID;
                            api.sendMessage(messageData, threadID, function (err1, data1) {
                                if (err1) {
                                    console.log("Msg Failed: ", threadID);
                                    callback(err1, data1);
                                } else {
                                    console.log("Msg Sent: ", threadID);
                                    callback(err1, data1);
                                }
                            });
                        }
                    });
                });
            } else {
                // number
                task.push(function (callback) {
                    api.sendMessage(messageData, id, function (err1, data1) {
                        if (err1) {
                            console.log("Msg Failed: ", id);
                            callback(err1, data1);
                        } else {
                            console.log("Msg Sent: ", id);
                            callback(err1, data1);
                        }
                    });
                });
            }
        });
    }

    async.series(task, function (err, data) {
        console.log(err || data);
    });

    /*api.getFriendsList((err, data) => {
     if(err) return console.error(err);

     console.log(data);
     });*/

    /*api.setOptions({listenEvents: true});
     api.listen((err, message) => {
     console.log(message);
     api.sendMessage(message.body, message.threadID);
     });

     for(var i=0;i<20;i++){
     api.sendMessage('hello by testing bot!', '723876198', function () {
     console.log(arguments);
     });
     }*/


});






