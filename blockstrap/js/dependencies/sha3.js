/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(v,p){var d={},u=d.lib={},r=function(){},f=u.Base={extend:function(a){r.prototype=this;var b=new r;a&&b.mixIn(a);b.hasOwnProperty("init")||(b.init=function(){b.$super.init.apply(this,arguments)});b.init.prototype=b;b.$super=this;return b},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
s=u.WordArray=f.extend({init:function(a,b){a=this.words=a||[];this.sigBytes=b!=p?b:4*a.length},toString:function(a){return(a||y).stringify(this)},concat:function(a){var b=this.words,c=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var n=0;n<a;n++)b[j+n>>>2]|=(c[n>>>2]>>>24-8*(n%4)&255)<<24-8*((j+n)%4);else if(65535<c.length)for(n=0;n<a;n+=4)b[j+n>>>2]=c[n>>>2];else b.push.apply(b,c);this.sigBytes+=a;return this},clamp:function(){var a=this.words,b=this.sigBytes;a[b>>>2]&=4294967295<<
32-8*(b%4);a.length=v.ceil(b/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var b=[],c=0;c<a;c+=4)b.push(4294967296*v.random()|0);return new s.init(b,a)}}),x=d.enc={},y=x.Hex={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],j=0;j<a;j++){var n=b[j>>>2]>>>24-8*(j%4)&255;c.push((n>>>4).toString(16));c.push((n&15).toString(16))}return c.join("")},parse:function(a){for(var b=a.length,c=[],j=0;j<b;j+=2)c[j>>>3]|=parseInt(a.substr(j,
2),16)<<24-4*(j%8);return new s.init(c,b/2)}},e=x.Latin1={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],j=0;j<a;j++)c.push(String.fromCharCode(b[j>>>2]>>>24-8*(j%4)&255));return c.join("")},parse:function(a){for(var b=a.length,c=[],j=0;j<b;j++)c[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new s.init(c,b)}},q=x.Utf8={stringify:function(a){try{return decodeURIComponent(escape(e.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return e.parse(unescape(encodeURIComponent(a)))}},
t=u.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new s.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=q.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,c=b.words,j=b.sigBytes,n=this.blockSize,e=j/(4*n),e=a?v.ceil(e):v.max((e|0)-this._minBufferSize,0);a=e*n;j=v.min(4*a,j);if(a){for(var f=0;f<a;f+=n)this._doProcessBlock(c,f);f=c.splice(0,a);b.sigBytes-=j}return new s.init(f,j)},clone:function(){var a=f.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});u.Hasher=t.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){t.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,c){return(new a.init(c)).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return(new w.HMAC.init(a,
c)).finalize(b)}}});var w=d.algo={};return d}(Math);
(function(v){var p=CryptoJS,d=p.lib,u=d.Base,r=d.WordArray,p=p.x64={};p.Word=u.extend({init:function(f,s){this.high=f;this.low=s}});p.WordArray=u.extend({init:function(f,s){f=this.words=f||[];this.sigBytes=s!=v?s:8*f.length},toX32:function(){for(var f=this.words,s=f.length,d=[],p=0;p<s;p++){var e=f[p];d.push(e.high);d.push(e.low)}return r.create(d,this.sigBytes)},clone:function(){for(var f=u.clone.call(this),d=f.words=this.words.slice(0),p=d.length,r=0;r<p;r++)d[r]=d[r].clone();return f}})})();
(function(v){for(var p=CryptoJS,d=p.lib,u=d.WordArray,r=d.Hasher,f=p.x64.Word,d=p.algo,s=[],x=[],y=[],e=1,q=0,t=0;24>t;t++){s[e+5*q]=(t+1)*(t+2)/2%64;var w=(2*e+3*q)%5,e=q%5,q=w}for(e=0;5>e;e++)for(q=0;5>q;q++)x[e+5*q]=q+5*((2*e+3*q)%5);e=1;for(q=0;24>q;q++){for(var a=w=t=0;7>a;a++){if(e&1){var b=(1<<a)-1;32>b?w^=1<<b:t^=1<<b-32}e=e&128?e<<1^113:e<<1}y[q]=f.create(t,w)}for(var c=[],e=0;25>e;e++)c[e]=f.create();d=d.SHA3=r.extend({cfg:r.cfg.extend({outputLength:512}),_doReset:function(){for(var a=this._state=
[],b=0;25>b;b++)a[b]=new f.init;this.blockSize=(1600-2*this.cfg.outputLength)/32},_doProcessBlock:function(a,b){for(var e=this._state,f=this.blockSize/2,h=0;h<f;h++){var l=a[b+2*h],m=a[b+2*h+1],l=(l<<8|l>>>24)&16711935|(l<<24|l>>>8)&4278255360,m=(m<<8|m>>>24)&16711935|(m<<24|m>>>8)&4278255360,g=e[h];g.high^=m;g.low^=l}for(f=0;24>f;f++){for(h=0;5>h;h++){for(var d=l=0,k=0;5>k;k++)g=e[h+5*k],l^=g.high,d^=g.low;g=c[h];g.high=l;g.low=d}for(h=0;5>h;h++){g=c[(h+4)%5];l=c[(h+1)%5];m=l.high;k=l.low;l=g.high^
(m<<1|k>>>31);d=g.low^(k<<1|m>>>31);for(k=0;5>k;k++)g=e[h+5*k],g.high^=l,g.low^=d}for(m=1;25>m;m++)g=e[m],h=g.high,g=g.low,k=s[m],32>k?(l=h<<k|g>>>32-k,d=g<<k|h>>>32-k):(l=g<<k-32|h>>>64-k,d=h<<k-32|g>>>64-k),g=c[x[m]],g.high=l,g.low=d;g=c[0];h=e[0];g.high=h.high;g.low=h.low;for(h=0;5>h;h++)for(k=0;5>k;k++)m=h+5*k,g=e[m],l=c[m],m=c[(h+1)%5+5*k],d=c[(h+2)%5+5*k],g.high=l.high^~m.high&d.high,g.low=l.low^~m.low&d.low;g=e[0];h=y[f];g.high^=h.high;g.low^=h.low}},_doFinalize:function(){var a=this._data,
b=a.words,c=8*a.sigBytes,e=32*this.blockSize;b[c>>>5]|=1<<24-c%32;b[(v.ceil((c+1)/e)*e>>>5)-1]|=128;a.sigBytes=4*b.length;this._process();for(var a=this._state,b=this.cfg.outputLength/8,c=b/8,e=[],h=0;h<c;h++){var d=a[h],f=d.high,d=d.low,f=(f<<8|f>>>24)&16711935|(f<<24|f>>>8)&4278255360,d=(d<<8|d>>>24)&16711935|(d<<24|d>>>8)&4278255360;e.push(d);e.push(f)}return new u.init(e,b)},clone:function(){for(var a=r.clone.call(this),b=a._state=this._state.slice(0),c=0;25>c;c++)b[c]=b[c].clone();return a}});
p.SHA3=r._createHelper(d);p.HmacSHA3=r._createHmacHelper(d)})(Math);

if (typeof Crypto == "undefined" || ! Crypto.util)
{
(function(){

var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// Global Crypto object
var Crypto = window.Crypto = {};

// Crypto utilities
var util = Crypto.util = {

        // Bit-wise rotate left
        rotl: function (n, b) {
                return (n << b) | (n >>> (32 - b));
        },

        // Bit-wise rotate right
        rotr: function (n, b) {
                return (n << (32 - b)) | (n >>> b);
        },

        // Swap big-endian to little-endian and vice versa
        endian: function (n) {

                // If number given, swap endian
                if (n.constructor == Number) {
                        return util.rotl(n,  8) & 0x00FF00FF |
                               util.rotl(n, 24) & 0xFF00FF00;
                }

                // Else, assume array and swap all items
                for (var i = 0; i < n.length; i++)
                        n[i] = util.endian(n[i]);
                return n;

        },

        // Generate an array of any length of random bytes
        randomBytes: function (n) {
                for (var bytes = []; n > 0; n--)
                        bytes.push(Math.floor(Math.random() * 256));
                return bytes;
        },

        // Convert a byte array to big-endian 32-bit words
        bytesToWords: function (bytes) {
                for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
                        words[b >>> 5] |= bytes[i] << (24 - b % 32);
                return words;
        },

        // Convert big-endian 32-bit words to a byte array
        wordsToBytes: function (words) {
                for (var bytes = [], b = 0; b < words.length * 32; b += 8)
                        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
                return bytes;
        },

        // Convert a byte array to a hex string
        bytesToHex: function (bytes) {
                for (var hex = [], i = 0; i < bytes.length; i++) {
                        hex.push((bytes[i] >>> 4).toString(16));
                        hex.push((bytes[i] & 0xF).toString(16));
                }
                return hex.join("");
        },

        // Convert a hex string to a byte array
        hexToBytes: function (hex) {
                for (var bytes = [], c = 0; c < hex.length; c += 2)
                        bytes.push(parseInt(hex.substr(c, 2), 16));
                return bytes;
        },

        // Convert a byte array to a base-64 string
        bytesToBase64: function (bytes) {

                // Use browser-native function if it exists
                if (typeof btoa == "function") return btoa(Binary.bytesToString(bytes));

                for(var base64 = [], i = 0; i < bytes.length; i += 3) {
                        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
                        for (var j = 0; j < 4; j++) {
                                if (i * 8 + j * 6 <= bytes.length * 8)
                                        base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
                                else base64.push("=");
                        }
                }

                return base64.join("");

        },

        // Convert a base-64 string to a byte array
        base64ToBytes: function (base64) {

                // Use browser-native function if it exists
                if (typeof atob == "function") return Binary.stringToBytes(atob(base64));

                // Remove non-base-64 characters
                base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");

                for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
                        if (imod4 == 0) continue;
                        bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2)) |
                                   (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
                }

                return bytes;

        }

};

// Crypto mode namespace
Crypto.mode = {};

// Crypto character encodings
var charenc = Crypto.charenc = {};

// UTF-8 encoding
var UTF8 = charenc.UTF8 = {

        // Convert a string to a byte array
        stringToBytes: function (str) {
                return Binary.stringToBytes(unescape(encodeURIComponent(str)));
        },

        // Convert a byte array to a string
        bytesToString: function (bytes) {
                return decodeURIComponent(escape(Binary.bytesToString(bytes)));
        }

};

// Binary encoding
var Binary = charenc.Binary = {

        // Convert a string to a byte array
        stringToBytes: function (str) {
                for (var bytes = [], i = 0; i < str.length; i++)
                        bytes.push(str.charCodeAt(i) & 0xFF);
                return bytes;
        },

        // Convert a byte array to a string
        bytesToString: function (bytes) {
                for (var str = [], i = 0; i < bytes.length; i++)
                        str.push(String.fromCharCode(bytes[i]));
                return str.join("");
        }

};

})();
}
