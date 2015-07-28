
(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();
var _AnalyticsCode = 'UA-64308622-1';
var _gaq = _gaq || [];
_gaq.push(['_setAccount', _AnalyticsCode]);


var install = localStorage.getItem("install");
console.log(install);
if (install == null)
{

    localStorage.setItem("install", 1);

    //ga('send', 'event', 'extension', 'install');
    _gaq.push(['_trackEvent', 'extension', 'install']);

}
chrome.identity.getAuthToken(
        {'interactive': true},
function () {

    window.gapi_onload = authorize;
    loadScript('https://apis.google.com/js/client.js');
    //console.log("auth load");
}
);

function loadScript(url) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState !== 4) {
            return;
        }

        if (request.status !== 200) {
            return;
        }

        eval(request.responseText);
    };

    request.open('GET', url);
    request.send();
}

function authorize() {
    gapi.auth.authorize(
            {
                client_id: '1005409181628-v1uqe9pf23qh1s6mfd6368ah21cg4lu4.apps.googleusercontent.com',
                immediate: true,
                scope: [
                    "https://mail.google.com",
                    "https://www.googleapis.com/auth/gmail.modify",
                    "https://www.googleapis.com/auth/gmail.compose"
                ]
            },
    function () {
        gapi.client.load('gmail', 'v1', Labellist);
        console.log("client id");
    }
    );
}

function gmailAPILoaded(userId, newLabelName, callback) {


    var request = gapi.client.gmail.users.labels.create({
        'userId': 'me',
        "labelListVisibility": "labelShow",
        "messageListVisibility": "show",
        "name": "Dmail"
    });
    request.execute(function (callback) {
        //console.log(callback);
        var labels = callback;
        var labelId = labels.id; console.log("id",labelId);
        localStorage.setItem("label", labelId);
    });
}

function Labellist() {
    var request = gapi.client.gmail.users.labels.list({
        'userId': 'me'
    });

    request.execute(function (resp) {
        var labels = resp.labels;

        var labelsdata = new Array();
        if (labels.length > 0) {
            for (i = 0; i < labels.length; i++) {
                var label = labels[i];
               //console.log("label",label);
                labelsdata[i] = label.name;
                if(label.name=='Dmail')
                {
                    localStorage.setItem("label", label.id);
                    console.log("id",label.id);
                }
               //console.log("name",label.name);
            }
            
            var listsearch = labelsdata.indexOf('Dmail', true);
            
            if (listsearch == -1)
            {
                gapi.client.load('gmail', 'v1', gmailAPILoaded);
            } else {
                console.log("c",label);
                console.log("label exists");
            }
        }
    });
}
function modifyMessage(messageId, callback) {
    var messageId = messageId;
    //console.log(messageId);
    var label = localStorage.getItem("label");
    var request = gapi.client.gmail.users.threads.modify({
        'userId': 'me',
        'id': messageId,
        'addLabelIds': [label],
        'removeLabelIds': []

    });
    request.execute(function (resp) {
        //console.log("labelAdd", resp);
    });
}




function getMessage(data, callback) {
//    threadId = '14e9ba17c4cb08b5';
//    var dmailId = "3767d9b9a649a7754027a59268d708aa0ccb4130";
//    var senderId = "rupamranjan007@gmail.com";
    //console.log("messageId", data);
    var thread = data.thread;
    modifyMessage(thread);
    if (typeof data.message_id != "undefined" && typeof data.thread != "undefined" && typeof data.senderId != "undefined")
    {

        var request = gapi.client.gmail.users.messages.get({
            'userId': 'me',
            'id': data.thread
        });
        request.execute(function (resp) {
            //console.log("callbackgmailapi", resp);
            var Id = resp;

            //console.log(Id.payload.headers);
            var gmailId = Id.payload.headers;
            for (i = 0; i < gmailId.length; i++)
            {

                if (gmailId[i].name == "Message-ID")
                {
                    //console.log(gmailId[i].value);
                    var gmailUniqueId = gmailId[i].value;

                }
                //console.log("gmail", gmailUniqueId);
                //console.log("from", data.senderId);
                // var Data = new Array();
                if (typeof gmailUniqueId != "undefined" && typeof data.message_id != "undefined")
                {
//                   
                    var newData = {"message_id": data.message_id, "message_identifier": gmailUniqueId, "sender_email": data.senderId, "timer": data.timer};
                   
                    //console.log("array", newData);
                    var dmailData = JSON.stringify(newData);
                    console.log("JSON", dmailData);
                    //console.log("from", sendermail);
                    $.ajax({
                        contentType: "application/json",
                        url: "https://api.dmail.io/mobile/message/sent",
                        type: "POST",
                        data: dmailData,
                        headers: {'identified_email' :data.senderId},
                        dataType: "json",
                        sucess: function (gmail)
                        {
                            //console.log("success");
                        }
                    })

                }

            }
        });
        return false;
    }

}

//var data;
//chrome.runtime.onMessage.addListener(
//        function (request, sender, sendResponse) {
//            if (request.event == "gmailData")
//                //console.log(request.data);
//            var data = request.data;
//            if (typeof request.data.message_id != 'undefined' && typeof request.data.thread != 'undefined' && typeof request.data.senderId != 'undefined')
//            {
//                //console.log("ins", data);
//                var gmailId = getMessage(data);
//                sendResponse({
//                    msg: "message"
//
//                });
//
//            }
//
//
//        });



