var Api = {};

Api.domain = 'http://192.168.200.155:8000';

Api.ajax = function (option) {
    $.ajax({
        url: this.domain + option.url,
        type: option.type || 'get',
        data: option.data || {},
        success: function (data) {
            if (typeof option.success == 'function') {
                option.success(data);
            }
        },
        error: function (err) {
            if (typeof option.error == 'function') {
                option.error(err);
            }
        }
    });
}
Api.ajaxPost = function (option) {
    $.ajax({
        url: this.domain + option.url,
        type: 'post',
        contentType: 'application/json;charset=UTF-8',
        data: option.data || {},
        success: function (data) {
            if (typeof option.success == 'function') {
                option.success(data);
            }
        },
        error: function (err) {
            if (typeof option.error == 'function') {
                option.error(err);
            }
        }
    });
}

//设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
//获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

$(function () {
    var name = getCookie('netsiteusername');
    $('#siteUserName').html(name);
    $('#loginOut').click(function () {
        Api.ajax({
            url: '/user/loginOut',
            success: function (data) {
                if (data.result === '1') {
                    location.href = '/html/login.html';
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    });
})