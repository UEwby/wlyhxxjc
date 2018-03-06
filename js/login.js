$(function(){
	//$(".header-wrap .nav li").eq(0).addClass('active');

	$(".group .text").focus(function(){
		$("#err").html('');
	})
	$("#btnSubmit").click(function(){
		var params = {
			username: $("#username").val(),
			password: $("#pwd").val()
		}
		if(params.username.replace(' ') === '' && params.password.replace(' ') === ''){
			$("#err").html('用户名和密码不能为空');
			return
		}else if (params.username.replace(' ') === ''){
			$("#err").html('用户名不能为空');
			return
		}else if(params.password.replace(' ') === ''){
			$("#err").html('密码不能为空');
			return
		}else{
			$("#err").html('');
		}
		submitLogin(params)
	})
});
function submitLogin(params){
	Api.ajax({
		url: '/user/login',
		data:params,
		success: function (data) {
			if (data.result === '1') {
				setCookie('netsiteusername',$("#username").val(),1);
				window.location.href = "/html/index.html";
			}else if(data.result === '1000'){
				$("#err").html(data.msg);
		}
		},
		error: function (err){
			//$("#err").html(err);
		}
	})
}