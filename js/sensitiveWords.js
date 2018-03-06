$(function () {
    $(".header-wrap .nav li").eq(3).addClass('active');
    //创建
    $("#btnCreate").on('click', function () {
        layer.open({
            type: 1,
            title: false,
            area: ['500px', '380px'], //宽高
            shade: [0.7, '#000', true],
            closeBtn: 0,
            content: $("#addKeyWordModal")
        });
        return false;
    });

    $(document).on('click', '.modal-close,.btn-closeModal', function () {
        layer.close(layer.index);
    });

    var laypage;
    layui.use(['form', 'laydate', 'laypage'], function () {
        var laydate = layui.laydate;
        //执行一个laydate实例
        laydate.render({
            elem: '#test1' //指定元素
        });
        laypage = layui.laypage;
        getData(1);
    });


    $("#btn-search-Keywords").on('click', function () {
        getData(1);
        return false;
    });

    function getData(page) {
        var url = '/keyword/list?rows=10&page=' + page;
        var txt = $("#txtKeywords").val();
        var type = $("#selectType .layui-this").attr('lay-value');
        if (txt) {
            url += '&text=' + txt;
        }
        if (type && type != '0') {
            url += '&type=' + type;
        }
        Api.ajax({
            url: url,
            success: function (data) {
                console.log(data);
                $("#listContent").html('');
                $("#page").html('')
                if (data.result != '1') {
                    return;
                }
                if(data.data && data.data.length === 0){
                    $("#noData").css({display:'block'})
                    return false
                }else{
                    $("#noData").css({display:'none'})
                }
                template.helper("xx", function (a) {
                    return (page - 1) * 10 + a + 1;
                });
                var html = template('listTemplate', data);
                $('#listContent').html(html);
                var p = page;
                laypage.render({
                    elem: 'page',
                    curr: page,
                    count: data.count,
                    layout: ['prev', 'page', 'next', 'skip'],
                    last: false,
                    first: false,
                    prev: '上一页',
                    next: '下一页',
                    theme: '#4ea5ff',
                    jump: function (obj) {
                        if (obj.curr != p) {
                            getData(obj.curr);
                        }
                    }
                });

            }
        });
        return false;
    }

    // 删除
    $(document).on('click', '.keyword-table .link-del', function () {
        var id = $(this).attr('keyid');
        var jsonStr = JSON.stringify({id:id});
        Api.ajaxPost({
            url: '/keyword/delete',
            data:jsonStr,
            success: function (data) {
                if (data.result === '1') {
                    getData(1);
                }
            }
        });
    });

    // 添加
    $('#btn-SaveKeywords').on('click', function () {
        $('#txt-err').removeClass('show');
        var key = $('#txtAddKeywords').val();
        var type = $("#modalTypeSelect .layui-this").attr('lay-value');
        if (key == '') {
            $('#txt-err').addClass('show');
            $('#txtAddKeywords').focus()
            return false;
        }
        var jsonStr = JSON.stringify({'text':key,'type':type});
        Api.ajaxPost({
            url: '/keyword/add',
            data:jsonStr,
            success:function(data){
                getData(1);
            }
        });
        return false;
    });

});