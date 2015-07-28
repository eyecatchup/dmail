define([
    'lib/backbone',
    'jquery'
], function (Backbone, jQuery) {

    return Backbone.View.extend({
        _api: null,
        _compose: null,
        template: _.template("<div><div class='dmail-button' role='button' tabindex='1' data-tooltip='Send &#8234;(⌘Enter)&#8236;' aria-label='Send &#8234;(⌘Enter)&#8236;'  style='-webkit-user-select: none;'>Send</div><img src='" + chrome.extension.getURL("img/logo-128.png") + "' style='margin-top: 3px;  margin-left: 8px;width: 31px;'><div id='dl'><b>Dmail:</b>  On</div><input id='dmail-toggle-1' class='dmail-toggle dmail-toggle-round' type='checkbox'><label for='dmail-toggle-1' id='switchbtn'></label><div id='destroy'>Destroy:<div class='dropdown'><div id='drp-text' time='0'>Never</div></div></div><div class='dmail-dropdown'><ul class='dropdown-menu' role='menu' style='display: none;'><li><a href='#' dm='0'>Never</a></li><li><a href='#' dm='1' data=''>In 1 hour</a></li><li><a href='#' dm='2' data=''>In 1 day</a></li><li><a href='#' dm='3' data=''>In 1 week</a></li></ul></div></div>"),
        events: {
            "click .dmail-button": "_onSend",
            "click #switchbtn": "_changeText",
            "click .dropdown": "_showMenu",
            "click .dmail-dropdown li a": "_onMenu"

        },
        initialize: function (obj) {
            console.log("COMPOSE FOOTER:::::", obj);

            this.app = obj.app
            this._api = obj.api;
            this._compose = obj.compose;
            this.render();

            var manager = this.app.getManager("message")
            manager.on(manager.SERVER_ERROR, $.proxy(this._onError, this));
            manager.on(manager.MESSAGE_CREATED, $.proxy(this._onMessageCreated, this));
            manager.on(manager.MESSAGE_SENT,$.proxy(this._onSentMail, this));

        },

        render: function () {
            //console.log("Rendering", this.$el);
            this.$el.append(this.template());
            var status = localStorage.getItem("button_status");
            if (status == null || status == 0)
            {
                $('#dmail-toggle-1').prop('checked', true);
                $(".dmail-button").removeClass("dmail-display");
                $("#destroy").removeClass("disableDmail");
                this._compose.$el.find(".T-I.J-J5-Ji.aoO.T-I-atl.L3[role=button]").addClass("dmail-display");

            } else if (status == 1)
            {
                $(".dmail-button").addClass("dmail-display");
                $("#destroy").addClass("disableDmail");
                this._compose.$el.find(".T-I.J-J5-Ji.aoO.T-I-atl.L3[role=button]").removeClass("dmail-display");
                $("#dl").html("<b>Dmail:</b> Off");
            }

            return this;
        },

        _onError: function () {
            var self = this;
            //console.error("compose footer sees there was an error!")
            self.$el.find(".dmail-error").remove();
            self.$el.prepend("<div class='dmail-error'>Unable to reach Dmail Service, Please try again later.</div>");
            setTimeout(function () {
                self.$el.find(".dmail-error").fadeOut()
            }, 5 * 1000)
        },
        _onMessageCreated: function (message) {

            var recipients = this._compose.recipients();
            var recipientManager = this.app.getManager("recipient")
            var expiration = null;
            

            //console.log("READY TO SEND!", recipients)

            // Now we need to attach all the recipients
            // Add recipients
            if (typeof recipients["to"] !== "undefined") {
                _.each(recipients.to, function (recipient) {
                    recipientManager.add(message, recipient, "TO", expiration);
                });
            }
            if (typeof recipients["cc"] !== "undefined") {
                _.each(recipients.cc, function (recipient) {
                    recipientManager.add(message, recipient, "CC", expiration);
                });
            }
            if (typeof recipients["bcc"] !== "undefined") {
                _.each(recipients.to, function (recipient) {
                    recipientManager.add(message, recipient, "BCC", expiration);
                });
            }
            //this.app.getManager("tracking").track("send.mail", {}, this._api.get.user_email(), recipients);
            //console.log("Recipients ADDED!")
            this.remove()

            // Update the body with the encrypted message...
            this._compose.body(message.getEmailMessage());
            this._compose.$el.find(".T-I.J-J5-Ji.aoO.T-I-atl.L3[role=button]").click();
            return false;
        },
        _onSend: function (event) {
            var timer=$("#drp-text").attr("time");
            var time=new Date(timer).toUTCString();
            var DmailData = {"timer": $("#drp-text").attr("time")};
            localStorage.setItem("DmailData",JSON.stringify(DmailData));
            var manager = this.app.getManager("message")
            
            // Create the new message
            message = manager.create(this._compose.id(), this._api.get.user_email(), this._compose.body());
            //console.log(message);

        },
        _changeText: function () {
            console.log($("#dl").html());
            var check = $('#dmail-toggle-1:checked').length;

            if (check == 1)
            {
                //console.log("ok", $('#dmail-toggle-1:checked').length);
                $("#dl").html("<b>Dmail:</b> Off");
                $(".dmail-button").addClass("dmail-display");
                $("#destroy").addClass("disableDmail");
                $(".dropdown-menu").hide();
                this._compose.$el.find(".T-I.J-J5-Ji.aoO.T-I-atl.L3[role=button]").removeClass("dmail-display");
            }
            else if (check === 0) {
                $("#dl").html("<b>Dmail:</b> On");
                $(".dmail-button").removeClass("dmail-display");
                $("#destroy").removeClass("disableDmail");
                this._compose.$el.find(".T-I.J-J5-Ji.aoO.T-I-atl.L3[role=button]").addClass("dmail-display");

            }
            localStorage.setItem("button_status", $('#dmail-toggle-1:checked').length);

        },
        _showMenu: function () {
            $(".dropdown-menu").toggle();
        },
        _onMenu: function (event) {
            //console.log($(event.currentTarget).text());
            var date = new Date();
            
            if ($(event.currentTarget).attr("dm") == 1)
            {
                var dm = date.setHours(date.getHours() + 1);
                //var dm=date.setMinutes(date.getMinutes()+5);
                var UtcTime = new Date(dm).toUTCString();
                var Utctimestamp = new Date(UtcTime).getTime();
                var newTime=Math.round(Utctimestamp/1000);
                
                //console.log("ime",newTime);console.log("ty",new Date(Utctimestamp));
                var timestamp = $("#drp-text").attr("time", Utctimestamp);
                //console.log("UTC",UtcTime);
                $("#drp-text").html($(event.currentTarget).text());
                $(".dropdown-menu").hide();
            }
            else if ($(event.currentTarget).attr("dm") == 2)
            {
                //var min=date.setMinutes(date.getMinutes()+15);
                var dm = date.setDate(date.getDate() + 1);
                var UtcTime = new Date(dm).toUTCString();
                //console.log(new Date(dm).toUTCString());
                var Utctimestamp = new Date(UtcTime).getTime();
                //console.log(new Date(UtcTime).getTime());
                var timestamp = $("#drp-text").attr("time", Utctimestamp);
                $("#drp-text").html($(event.currentTarget).text());
                $(".dropdown-menu").hide();
            }
            else if ($(event.currentTarget).attr("dm") == 3)
            {
                //var dm = date.setHours(date.getHours() + 1);
                var dm = date.setDate(date.getDate() + 7);
                var UtcTime = new Date(dm).toUTCString();
                //console.log(new Date(dm).toUTCString());
                var Utctimestamp = new Date(UtcTime).getTime();
                //console.log(new Date(UtcTime).getTime());
                var timestamp = $("#drp-text").attr("time", Utctimestamp);
                $("#drp-text").html($(event.currentTarget).text());
                $(".dropdown-menu").hide();
            }
            else {
                var timestamp = $("#drp-text").attr("time", "0");
                $("#drp-text").html($(event.currentTarget).text());
                $(".dropdown-menu").hide();
            }
          
        },
        _onSentMail:function(){
            var key="<CAFJAbc_KFdGgpR9K+avSn9eKWhKDFpkwF1jAfPvjN0jw1X=m+w@mail.gmail.com>";
            var Data = JSON.parse(localStorage.getItem("DmailData"));
            
             var newData = {"message_id": Data.message_id, "message_identifier": key, "sender_email": localStorage.getItem("dmid"), "timer": Data.timer};
             var dmailData = JSON.stringify(newData);

             $.ajax({
                contentType: "application/json",
                url: "https://api.dmail.io/mobile/message/sent",
                type: "POST",
                data: dmailData,
                headers: {'identified_email' :localStorage.getItem("dmid")},
                dataType: "json",
                sucess: function (gmail)
                {
                 localStorage.setItem("timeset",1);
                }
            })
        },
        remove: function () {
            // Destroy bindings
            var manager = this.app.getManager("message");
            manager.off(manager.SERVER_ERROR, $.proxy(this._onError, this));
            manager.off();
            manager.off(manager.MESSAGE_SENT,$.proxy(this._onSentMail, this));
            Backbone.View.prototype.remove.apply(this, arguments);
        }


    });

});