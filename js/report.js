$(function () {
    $(".header-wrap .nav li").eq(2).addClass('active');
    initData();
    // 初始化数据
    function initData() {
        Api.ajax({
            url: '/report/list',
            success: function (data) {
                if (data.result === '1') {
                    var html = template('fileTemplate', data);
                    $("#fileList").html(html);
                }
            }
        });
    }

    // 上传
    $("#btn-upload").on('click',function(){
        var file = $('#fileUpload').val();
        if(file){
            $("#form1").ajaxSubmit(function(data){
                if(data.result === '1'){
                    initData();
                }
            });
        }
        return false;
    });
});
// 下载
function fileDown(id) {
    $('#iframeDownFile').attr('src', Api.domain + '/report/download?id=' + id);
}