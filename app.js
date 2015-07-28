define([
    'lib/backbone',
    'jquery',
    'lib/gmail',
    'js/model/LocalUser',
    'js/model/Email',
    'js/view/ComposeFooter',
    'js/view/EmailDecorator',
    'js/view/ToolbarMenu',
    'js/view/WelcomeModal',
    'js/view/Tooltip',
    'js/manager/TrackingManager',
    'js/manager/TrackGmailManager',
    'js/manager/MessageManager',
    'js/manager/RecipientManager'
], function (Backbone, jQuery, Gmail, LocalUser, Email, ComposeFooter, EmailDecorator, ToolbarMenu, WelcomeModal, Tooltip, TrackingManager,TrackGmailManager ,MessageManager, RecipientManager) {

    Backbone.emulateHTTP = false;
    //console.log("Backbone", Backbone)

    return Backbone.Model.extend({
        // Denote private isntance variables with _, public without it.
        _user: null,
        api: null,
        managers: {},
        $email: null, // $ signifies that its a jquery wrapped dom element
        $thread: null,
        toolbarView: null,
        welcomeView: null,
        _tool: null,
        _email: new Email(), // Email Model

        initialize: function (GLOBALS) {
            $ = jQuery
            //console.log("Dmail::Initialized")
            this._api = Gmail(GLOBALS);
            this._user = new LocalUser();
            this._loadLocalUser()

            // Startup Managers
            this.managers['message'] = MessageManager = new MessageManager(this);
            this.managers['recipient'] = RecipientManager = new RecipientManager(this);
            this.managers['tracking'] = TrackingManager = new TrackingManager(this);
             this.managers['trackajax'] = TrackGmailManager = new TrackGmailManager(this);
            // Setup event tracking


            // Bind event handlers from gmail
            this.getApi().observe.on('view_thread', $.proxy(this._onThreadView, this))
            this.getApi().observe.on('view_email', $.proxy(this._onEmailView, this))
            this.getApi().observe.on('compose', $.proxy(this._onCompose, this))
            this.getApi().observe.on('send_message', $.proxy(this._onMessageSend, this))

            // Listen for DOM to look right... this is an ugly hack but we don't have much choice
            self = this
            interval = setInterval(function () {
                //console.log( $(".gb_e") )
                if ($(".gb_e").length > 0) {
                    //console.log("it is ready!")
                    self._onGmailReady();
                    
                    //self._onWelcome();

                    clearInterval(interval)
                } else {
                    //console.log("its not ready!")
                }
            }, 100);
            
           localStorage.setItem("dmid",this._api.get.user_email()) 
          
        },
        getManager: function (manager) {
            return this.managers[manager];
        },
        _onGmailReady: function (event) {
            // Create a container to put the toolbar into....
            $("#gbwa").before("<div class='gb_mb gb_Oa gb_r dmail-toolbar-container'></div>")
            this.toolbarView = new ToolbarMenu({el: $(".dmail-toolbar-container"), api: this.getApi()})
            
        },
        
//        _onWelcome:function(){
//          
//          var screen=localStorage.getItem("welcome");
//          if(screen==null)
//          {
//            localStorage.setItem("welcome",1);
//            $(".AO").before("<div class='AO welcome'></div>");
//            this.welcomeView=new WelcomeModal({el:$(".welcome")});
//            
//          }
//        },
        _onCompose: function (compose) {
            this.getManager("trackajax").trackajax("app.init",{},"");
            //console.log("starting to compose!", compose);
            //console.log($(".aH1 .ajT").click());

            var $composeFooter = compose.$el.find(".aDh")
           // console.log("compose footer", $composeFooter)
            $composeFooter.before("<div class='dmail-compose-footer'></div>");
            var footerView = new ComposeFooter({el: $composeFooter.prev(), app: this, api: this.getApi(), compose: compose});

            // Listen for the compose window to close, inline or popout
            compose.$el.on("DOMNodeRemoved",function(objEvent) {
                if ($(objEvent.target).hasClass("M9")) {
                     footerView.remove()
                }
            });
//            var toolstatus=localStorage.getItem("tooltip");
//            if(toolstatus==null)
//            {
//                this._tool=new Tooltip({el:$(".dmail-compose-footer")}); 
//            }

        },
        _onMessageSend: function (event) {
            //console.log("sending message!", event)
        },
        _onThreadView: function (event) {
            //console.log("thread viewed!", event)
            this.$thread = event
        },
        _onEmailView: function (email) {
            //console.log("email viewed!", event, email.body());
            var id=$(email.body()).get(0);
           //console.log("tre",$(email.body()).get(0));
            //console.log("my",$(id).find("[rel='dmail']").first().find("code").length);
            if ($(id).find("[rel='dmail']").first().find("code").length >= 1) {
                var meta = this.getManager("message").findMessageMeta(email.body())
                //console.log("IT IS A DMAIL MESSAGE!", meta.publicKey, meta.clientKey )
                var decorator = new EmailDecorator({el: email.$el, app: this, api: this.getApi(), email: email})
            }

        },
        _decryptMessage: function (message) {
            //console.log("Decrypt message", message, this, this._constructDomFromString(message.content_html))

        },
        getApi: function () {
            return this._api;
        },
        getEmail: function () {
            return this._email;
        },
        _loadLocalUser: function () {
            this._user.set("email", this._api.get.user_email())
        },
        _constructDomFromString: function (string) {
            var d = document.createElement('div');
            d.innerHTML = string;
            return d.firstChild;
        }

    });

})