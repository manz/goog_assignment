'use strict';

module.exports = {
    get: (url) => {
        return new Promise((resolve, reject) => {
            var client = new XMLHttpRequest();
            client.open('GET', url);
            client.send();

            client.onload = () => {
                if (client.status >= 200 && client.status < 300) {
                    resolve(client.response);
                }
                else {
                    reject(client.statusText);
                }
            };

            client.onerror = () => {
                reject(client.statusText);
            };
        })
    },
    getScript: (source) => {
        return new Promise((resolve, reject) => {
            var script = document.createElement('script');
            var prior = document.getElementsByTagName('script')[0];
            script.async = 1;
            prior.parentNode.insertBefore(script, prior);

            script.onload = script.onreadystatechange = function (_, isAbort) {
                if (isAbort) {
                    reject();
                }
                if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                    script.onload = script.onreadystatechange = null;
                    script = undefined;
                    resolve()
                }
            };

            script.src = source;
        })
    }

};
