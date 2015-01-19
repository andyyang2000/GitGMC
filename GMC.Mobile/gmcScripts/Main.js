$(function () {
    $.mobile.page.prototype.options.domCache = false;
});

function Login(mobile, password, callBack) {
    Ajax.getJson("MobileLogin", { "phoneNumber": mobile, "password": password, "accountType": 0 }, function (data) {
        if (data.IsSuccess) {
            localStorage.setItem("account", data.Data.PhoneNumber);
            localStorage.setItem("accountId", data.Data.Id);

            if (data.M_Customer != null)
            {
                localStorage.setItem("firstName", data.Data.M_Customer.FirstName);
                localStorage.setItem("lastName", data.Data.M_Customer.LastName);
            }

            if($.isFunction(callBack)){
                callBack();
            }
        } else {
            Messagebox.popup(data.Message);
        }
    });
}

$(document).on("pageinit", "[data-role='page']", function () {
    $("#pageLoadingCount").val("0");
});

function checkLogin() {
    if (window.localStorage.getItem("account") == null || window.localStorage.getItem("accountId") == "")
    {
        return false;
    }

    return true;
}


function callServiceCallBack(buttonIndex) {
    if (buttonIndex == 2) {
        window.open('tel:4006997118', '_system');
    }
}

function closePopup(obj, id) {
    $(obj).parents("[data-role='page']").find("#" + id).popup("close");
}

function showBubbleOnTA()
{
    showBubble('<br>Please choose a service category.', "next", true, function () {
        $("#divCategoryImg").hide();
        showBubble('<br>Then pick a tradie on map.<br><img src="Images/iconfont-marker.png" style="width:16px;vertical-align:middle ">', "next", true, function () {
            showBubble('<br>You can change settings anytime.', "next", true, function () {
                $("#divMenuImg").hide();
                showBubble('<br>You can search out people anytime.', "next", true, function () {
                    showBubble('<br>You can search out people anytime.', "Start", false, function () {
                    }, function () {
                        $("#coverDiv_btn").attr("style", "background-color:#5dade2;border-color:#5dade2");
                    });
                }, function () {
                                
                });
            }, function () {
                $("#divMenuImg").show();
            });
        }, function () {
            $("#divMenuImg").show();
        });
    }, function () {
        $("#divCategoryImg").show();
    });
}