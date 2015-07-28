
GLOBALS = null
requirejs.config(requirejsConfig);
requirejs(['jquery', 'lib/underscore', 'lib/backbone', 'lib/md5.min', 'lib/gmail', 'app'],
        function ($, underscore, Backbone, md5, Gmail, App) {

            _load = function (GLOBALS) {
                new App(GLOBALS);

            }

            // There is a potential race condition here because we may not laod all our dependencies prior to the gmail GLOBAL
            // being passed through to us from the main page
            if (GLOBALS === null) {
                document.addEventListener("gmail.ready", function (event) {
                    _load(event.detail)
                });
            } else {
                _load(GLOBALS)
            }


        });

// Append a script that can be used to inject data into the content script at startup
var init = document.createElement('script');
init.src = chrome.extension.getURL('ready.js');
(document.head || document.documentElement).appendChild(init);

var gm = document.createElement('script');
gm.src = chrome.extension.getURL('gmailAjax.js');
(document.head || document.documentElement).appendChild(gm);

var ga = document.createElement('script');
ga.src = chrome.extension.getURL('tracker.js');
(document.head || document.documentElement).appendChild(ga);

document.addEventListener("gmail.ready", function (event) {
    //console.log("Gmail ready triggered premature.")
    GLOBALS = event.detail
});

document.addEventListener("ajax.message.complete", function (event) {

//    console.log("CONTENT SCRIPT SEEING COMPLETED AJAX SCRIPT");
//    console.log("DAta", event);
//    console.log("found match", event.detail.responseURL);
    var Data = JSON.parse(localStorage.getItem("DmailData"));
    //console.log(Data);
    if(Data!=null)
    {
    if (typeof Data.message_id!="undefiend" && typeof Data.thread=="undefined")
    {
        
        var variable = event.detail.responseURL;
        var st = variable.split('&');
        for (i = 0; i < st.length; i++)
        {

            var Url = st[i].split("=");
            if (Url[0] == "th")
            {

                var thread = Url[1];
                //console.log("threadId", thread);
                Data.thread=thread;

            }
        }
        var senderId=localStorage.getItem("dmid");
        Data.senderId=senderId;
        //console.log("fdata",Data);
        
        //var messageHash = String(Data[0])+String(Data[1])+String(senderId);
//        if(typeof Data.message_id!="undefiend" && typeof Data.thread!="undefined")
//        {
//          chrome.runtime.sendMessage({event: "gmailData", data: Data}, function (response) {
//            //console.log("respinse",response.msg);
//           if(response.msg=='message')
//           {
//               localStorage.removeItem("DmailData");
//           }
//            
//        });
//        }
       
    }
}

});
//console.log("hello");


