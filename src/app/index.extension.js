 "use strict";

window.setIframeHeight = function(obj) {
     var win = obj;
     // console.log(win)
     setTimeout(function() {
         if (document.getElementById && win) {
             if (window.opera) {
                 //Opera
                 if (win.contentWindow.document && win.contentWindow.document.body.scrollHeight) {
                     win.height = win.contentWindow.document.body.scrollHeight;
                 }
             } else {
                 if (win.contentDocument && win.contentDocument.body.offsetHeight) {
                     //IE8、、FireFox、Chrome
                     win.height = win.contentDocument.body.offsetHeight;
                 } else if (win.Document && win.Document.body.scrollHeight) {
                     //IE7
                     win.height = win.Document.body.scrollHeight;
                 }
             }
         }
     });
 }
 if (!String.prototype.format) {
     String.prototype.format = function() {
         var args = arguments;
         return this.replace(/{(\d+)}/g, function(match, number) {
             return typeof args[number] != 'undefined' ? args[number] : match
         })
     }

 }
 if (!String.prototype.trim) {

     String.prototype.trim = function() {
         return this.replace(/^\s*/, "").replace(/\s*$/, "");
     }

 }
 if (!String.prototype.toBoolean) {

     String.prototype.toBoolean = function() { 
         return this=="1";
     }

 }
 if (!Boolean.prototype.tooString) {
     Boolean.prototype.tooString = function() { 
         return this?1:0;
     }

 }

 Array.prototype.unique=function() {
     var hash = {},
         len = this.length,
         result = [];

     for (var i = 0; i < len; i++) {
         if (!hash[this[i]]) {
             hash[this[i]] = true;
             result.push(this[i]);
         }
     }
     return result;
 }
 String.IsNullOrEmpty = function(value) {
     if (value) {
         if (typeof(value) == 'string') {
             if (value.length > 0)
                 return false;
         }
         if (value != null)
             return false;
     }
     return true;
 }

 if (!String.prototype.parameters) {

     String.prototype.parameters = function() {
         var result = {};
         var reg = new RegExp('([\\?|&])(.+?)=([^&?]*)', 'ig');
         var arr = reg.exec(this);
         while (arr) {
             result[arr[2]] = arr[3];
             arr = reg.exec(this);
         }
         return result;
     }


 }
 if (!String.prototype.stripTags) {
     //移除html
     String.prototype.stripTags = function() {
         return this.replace(/<\/?[^>]+>/gi, '');
     }

 }
 if (!String.prototype.getNum) {
     //保留数字
     String.prototype.stripTags = function() {
         return this.replace(/[^d]/g, "");
     }

 }
 if (!String.prototype.getEn) {
     // 保留字母
     String.prototype.getEn = function() {
         return this.replace(/[^A-Za-z]/g, "");
     }


 }
 if (!String.prototype.getCn) {
     // 保留中文
     String.prototype.getCn = function() {
         return this.replace(/[^u4e00-u9fa5uf900-ufa2d]/g, "");
     }
 }
 if (!Date.prototype.format) {
     Date.prototype.format = function(format) {
         var date = {
             "M+": this.getMonth() + 1,
             "d+": this.getDate(),
             "h+": this.getHours(),
             "m+": this.getMinutes(),
             "s+": this.getSeconds(),
             "q+": Math.floor((this.getMonth() + 3) / 3),
             "S+": this.getMilliseconds()
         };
         if (/(y+)/i.test(format)) {
             format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
         }
         for (var k in date) {
             if (new RegExp("(" + k + ")").test(format)) {
                 format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
             }
         }
         return format;
     }


 };
 window.StringBuilder = function(str) {
     this.tmp = new Array();
 }
 window.generateMixed = function(n) {
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var res = "";
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    return res;
 }
 StringBuilder.prototype.Append = function(value) {
     this.tmp.push(value);
     return this;
 }
 StringBuilder.prototype.Clear = function() {
     tmp.length = 1;
 }
 StringBuilder.prototype.toString = function() {
     return this.tmp.join('');
 }
$.extend({
    /**
     * 清除当前选择内容
     */
    unselectContents: function() {
        if (window.getSelection) window.getSelection().removeAllRanges();
        else if (document.selection) document.selection.empty();
    }
});
$.fn.extend({
    /**
     * 选中内容
     */
    selectContents: function() {
        $(this).each(function(i) {
            var node = this;
            var selection, range, doc, win;
            if ((doc = node.ownerDocument) && (win = doc.defaultView) && typeof win.getSelection != 'undefined' && typeof doc.createRange != 'undefined' && (selection = window.getSelection()) && typeof selection.removeAllRanges != 'undefined') {
                range = doc.createRange();
                range.selectNode(node);
                if (i == 0) {
                    selection.removeAllRanges();
                }
                selection.addRange(range);
            } else if (document.body && typeof document.body.createTextRange != 'undefined' && (range = document.body.createTextRange())) {
                range.moveToElementText(node);
                range.select();
            }
        });
    },
    /**
     * 初始化对象以支持光标处插入内容
     */
    setCaret: function() {
        if (!$.browser.msie) return;
        var initSetCaret = function() {
            var textObj = $(this).get(0);
            textObj.caretPos = document.selection.createRange().duplicate();
        };
        $(this)
            .click(initSetCaret)
            .select(initSetCaret)
            .keyup(initSetCaret);
    },
    /**
     * 在当前对象光标处插入指定的内容
     */
    insertAtCaret: function(textFeildValue) {
        var textObj = $(this).get(0);
        if (document.all && textObj.createTextRange && textObj.caretPos) {
            var caretPos = textObj.caretPos;
            caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == '' ? textFeildValue + '' : textFeildValue;
        } else if (textObj.setSelectionRange) {
            var rangeStart = textObj.selectionStart;
            var rangeEnd = textObj.selectionEnd;
            var tempStr1 = textObj.value.substring(0, rangeStart);
            var tempStr2 = textObj.value.substring(rangeEnd);
            textObj.value = tempStr1 + textFeildValue + tempStr2;
            textObj.focus();
            var len = textFeildValue.length;
            textObj.setSelectionRange(rangeStart + len, rangeStart + len);
            textObj.blur();
        } else {
            textObj.value += textFeildValue;
        }
    }
});