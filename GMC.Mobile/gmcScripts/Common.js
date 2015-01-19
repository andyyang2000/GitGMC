var rootPath = "http://192.168.5.116/Api.svc/";
window.deviceReady = false; 
getCurrentPositionError = false;
var getCurrentPositionOption = { timeout: 2500, enableHighAccuracy: true };

// Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
function onDeviceReady() {
    window.deviceReady = true;

    document.addEventListener("backbutton", function (e) {
        if ($.mobile.activePage.is('#pageIndex')) {
            e.preventDefault();
            Messagebox.confirm("Do you want to close the TA for Tradie?", function (buttonIndex) {
                if (buttonIndex == 2) {
                    navigator.app.exitApp();
                }
            }, "Close the APP", ['NO', 'YES']);
        }
        else {
            navigator.app.backHistory()
        }
    }, false);

    navigator.splashscreen.hide();

    if (checkConnection()) {
        navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError, getCurrentPositionOption);
    }
}

function checkConnection() {
    if (!window.deviceReady) {
        return true;
    }

    var networkState = navigator.connection.type;

    if (networkState == Connection.NONE) {
        Messagebox.popup("No internet connection");
        return false;
    }

    return true;
}

function objToArray(obj) {
    var arr = [];
    $.each(obj, function () {
        arr.push(this);
    });

    return arr;
}

function changePage(url) {
    url = encodeURI(url);
    if (url.substr(0, 1) == "#") {
        $.mobile.navigate(url, {
            transition: "slide"
        });
    }
    else {
        $.mobile.navigate(url, {
            transition: "slide"
        });
    }
}

function refreshPage() {
    jQuery.mobile.changePage(window.location.href, {
        allowSamePageTransition: true,
        transition: 'none',
        reloadPage: true
    });
}

function getUrlParam(url, name) {
    url = decodeURI(url);
    if (url.indexOf("?") > -1) {
        url = url.split("?")[1];
    }

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = url.match(reg);
    if (r != null) return r[2]; return null;
}

var Messagebox = Messagebox ? Messagebox : {};
Messagebox = {

    alert: function (message, alertCallback, title, buttonName) {
        if (window.deviceReady && navigator) {
            if (!buttonName) {
                buttonName = "OK";
            }
            navigator.notification.alert(message, alertCallback, title, buttonName);
        }
        else {
            alert(message);
        }
    },

    //options.duration, // ‘short’, ‘long’
    //options.position, // ‘top’, ‘center’, ‘bottom’
    //options.successCallback, // optional succes function
    //options.errorCallback // optional error function
    popup: function (message, options) {
        if (!message) {
            return;
        }

        if (window.deviceReady) {
            var defaultOptions = {
                duration: "short",
                position: "center",
                successCallback: function () { },
                errorCallback: function () { }
            }

            options = $.extend(options, defaultOptions);

            window.plugins.toast.show(
                  message,
                  options.duration,
                  options.position,
                  options.successCallback,
                  options.errorCallback
          );
        }
        else {
            alert(message);
        }
    },

    //message：对话框信息。（字符串类型）
    //confirmCallback：按下按钮后触发的回调函数，返回按下按钮的索引（1、2或3）。（函数类型）
    //title：对话框标题。（字符串类型）（可选项，默认值为“Confirm”）
    //buttonLabels：逗号分隔的按钮标签字符串。(字符串类型)（可选项，默认值为“OK、Cancel”）
    confirm: function (message, confirmCallback, title, buttonLabels) {
        if (window.deviceReady && navigator) {
            if (!buttonLabels) {
                buttonLabels = ['Cancel', 'OK']
            }
            navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
        }
        else {
            window.confirm(message) ? confirmCallback(1) : confirmCallback(2);
        }
    },

    //message：对话框信息。（字符串类型）
    //promptCallback：按下按钮后触发的回调函数（函数类型）
    //title：对话框标题。（字符串类型）（可选项，默认值为“Prompt”）
    //buttonLabels：显示按钮标签字符串的数组。(Array)（可选项，默认值为["OK","Cancel"])
    prompt: function (message, promptCallback, title, buttonLabels) {
        if (window.deviceReady && navigator) {
            if (!buttonLabels) {
                buttonLabels = ['Cancel', 'OK']
            }
            navigator.notification.prompt(message, promptCallback, title, buttonLabels)
        } else {
            alert("Not implemented this function on windows");
        }
    },

    showLoading: function () {
        if (window.plugins) {
            window.plugins.spinnerDialog.show(null,null,true);
        }
        else {
            $.mobile.loading('show', {
                text: '',
                textVisible: false,
                theme: 'a',
                html: ""
            });
        }
    },

    hideLoading: function () {
        if (window.plugins) {
            window.plugins.spinnerDialog.hide();
        }
        else {
            $.mobile.loading('hide', {
                textVisible: false
            });window.localStorage.getItem("c_key")
        }
    }
};

var Ajax = Ajax ? Ajax : {};
Ajax = {
    getJson: function (url, data, callback) {
        var isNetworkWorked = checkConnection();
        if (!isNetworkWorked) {
            return;
        }
        /*Production up API invoke*/
        var apiUrl = rootPath + url;
        $.ajax({
            url: apiUrl,
            data: data,
            success: function (result) {
                if ($.isFunction(callback)) {
                    callback(result.d);
                }
            },
            dataType: "json",
            timeout: 15000,
            beforeSend: function () { var pageLoadingCount = parseInt($("#pageLoadingCount").val()); pageLoadingCount++; if (pageLoadingCount == 1) { Messagebox.showLoading() } },
            complete: function () { var pageLoadingCount = parseInt($("#pageLoadingCount").val()); pageLoadingCount--; if (pageLoadingCount <= 0) { Messagebox.hideLoading() } },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                if (window.deviceReady)
                {
                    Messagebox.popup("call API error");
                }
                else
                {
                    Messagebox.popup("Call API error:" + textStatus);
                }
            }
        });
    }
}

function showBubble(html,buttonText, showSkip,callback,beforeShow)
{
    $("#coverDiv #divBubble p").html(html);
    if (buttonText)
    {
        $("#coverDiv #divBubble a").text(buttonText);
    }

    $("#coverDiv #divBubble a").off("click").on("click", function () {
        $("#coverDiv").hide();
        if ($.isFunction(callback)) {
            callback();
        }
    });

    showSkip ? $("#coverDiv .skip").css("display", "block") : $("#coverDiv .skip").css("display", "none");

    if ($.isFunction(beforeShow))
    {
        beforeShow();
    }

    $("#coverDiv").show();
    $("#coverDiv_btn").buttonMarkup();
    $("#coverDiv_btn").css("width", "80px");
}

function getCurrentAccountId() {
    return window.localStorage.getItem("accountId");
}

function getPhoto(source, onPhotoURISuccess, onPhotoURIFailed) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onPhotoURIFailed, {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: source
    });
}

function MD5(obj) {
    return $.md5(obj);
}


//add callback if need 
$.fn.emptyValidate = function (message) {
    if ($.trim($(this).val()) == "") {
        Messagebox.popup(message);
        //$(this).focus();
        return false;
    }
    return true;
}

$.fn.telephoneValidate = function (message) {
    reg = /^1[0-9]{10}$/;
    if (!reg.test($(this).val())) {
        Messagebox.popup(message);
        $(this).val("");
        //$(this).focus();
        return false;
    }
    return true;
}

$.fn.passwordValidate = function (message) {
    reg = /^[a-zA-Z0-9]{6,16}$/;
    if (!reg.test($(this).val())) {
        Messagebox.popup(message);
        $(this).val("");
        //$(this).focus();
        return false;
    }
    return true;
}

