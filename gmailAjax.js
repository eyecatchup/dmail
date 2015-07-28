
[].slice.apply(document.querySelectorAll('iframe')).forEach(function (iframe) {
    try {
        
        var open = iframe.contentWindow.XMLHttpRequest.prototype.open,
        send = iframe.contentWindow.XMLHttpRequest.prototype.send,
        onReadyStateChange;

        function openReplacement(method, url, async, user, password) {
            var syncMode = async !== false ? 'async' : 'sync';
            /*console.warn(
                'Preparing ' +
                syncMode +
                ' HTTP request : ' +
                method +
                ' ' +
                url
            );*/
            return open.apply(this, arguments);
        }

        function sendReplacement(data) {
            //console.warn('Sending HTTP request data : ', data);

            if(this.onreadystatechange) {
                this._onreadystatechange = this.onreadystatechange;
            }
            this.onreadystatechange = onReadyStateChangeReplacement;

            return send.apply(this, arguments);
        }

        function onReadyStateChangeReplacement() {
            //console.warn('HTTP request ready state changed : ' + this.readyState);
            
            if (this.readyState == 4) {
                //console.log(" CALL COMPLETE !!!!!!! ", this ); 
                var event = new CustomEvent('ajax.message.complete', { 
                    detail: {
                        response: this.response,
                        responseURL: this.responseURL,
                        status: this.status,
                        statusText: this.statusText
                    }, 
                    bubbles: true, 
                    cancelable: false 
                });
                document.dispatchEvent(event);
            }
            if(this._onreadystatechange) {
                return this._onreadystatechange.apply(this, arguments);
            }
        }

        iframe.contentWindow.XMLHttpRequest.prototype.open = openReplacement;
        iframe.contentWindow.XMLHttpRequest.prototype.send = sendReplacement;

    } catch (e) {
    }
});