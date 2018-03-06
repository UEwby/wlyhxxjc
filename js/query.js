$(function () {

  function GetQueryString(name)
  {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  decodeURI(r[2]); return null;
  }
  //解析url

  if(GetQueryString('key')){
    $('#keyWord').val(GetQueryString('key'))
  }
    $(".header-wrap .nav li").eq(1).addClass('active');
    var laypage;
    layui.use(['form', 'laydate', 'laypage'], function () {
        var laydate = layui.laydate;

        //执行一个laydate实例
        laydate.render({
            elem: '#datestart' //指定元素
        });
        laydate.render({
            elem: '#dateend' //指定元素
        });
        //请求数据列表
        dataListQuery({
            keyWord: $('#keyWord').val(),
            typeName: '',
            startTime: '',
            endTime: '',
            rows: 10,
            page: 1
        })
        laypage = layui.laypage;
    })

    //fancybox
    $(".fancybox .ceng").click(function (event) {
        $(".fancybox").fadeOut(200)
    })
    $(".fancybox .close").click(function (event) {
        $(".fancybox").fadeOut(200)
    })
    $("#search").click(function () {
        var params = getParam(1);
        dataListQuery(params);
        return false;
    });
    $("#resetPara").click(function () {
      $('#keyWord').val('');
      $('#typeName dl dd').eq(0).addClass('layui-this').siblings().removeClass('layui-this')
      $('#typeName .layui-select-titlec').eq(0).val('全部')
      $('#typeName .layui-select-titlec').eq(0).text('全部')
      $('#typeName .layui-select-titlec').eq(0).html('全部')
      //$('#typeName .layui-select-title').eq(0).html('全部')
      $('#datestart').val('')
      $('#dateend').val('')
    });

    function dataListQuery(params) {
      $("#datalist").html('');
      $("#page").html('')
        Api.ajax({
            url: '/data/list',
            data: params,
            success: function (data) {
                console.log(data);
                if(data.data && data.data.length === 0){
                    $("#noData").css({display:'block'})
                    return false
                }else{
                    $("#noData").css({display:'none'})
                }
                if (data.result === '1') {
                    template.helper("xx", function (a) {
                        return (params.page - 1) * 10 + a + 1;
                    });
                    var html = template('tempList', data);
                    $("#datalist").html(html);
                    laypage.render({
                        elem: 'page',
                        count: data.count,
                        curr: params.page,
                        layout: ['prev', 'page', 'next', 'skip'],
                        last: false,
                        first: false,
                        prev: '上一页',
                        next: '下一页',
                        theme: '#4ea5ff',
                        jump: function (obj) {
                            if (obj.curr != params.page) {
                                var curpage = getParam(obj.curr);
                                dataListQuery(curpage);
                            }
                        }
                    })
                }
            }
        })
    }

    function getParam(page) {
      //  /html/query.html?key=site
        var params = {
            keyWord: $('#keyWord').val(),
            typeName: $('#typeName dl dd.layui-this').html() === '全部' ? '' : $('#typeName dl dd.layui-this').html(),
            startTime: $('#datestart').val(),
            endTime: $('#dateend').val(),
            rows: 10,
            //typeName:'涉赌',
            page: page
        }
        //console.log(params);
        return params;
    }
});
function fadeInFancyBox(id) {
    $(".fancybox").fadeIn(200)
    dataDetail(id)
}

function dataDetail(id) {
    Api.ajax({
        url: '/data/detail?id=' + id,
        success: function (data) {
            if (data.result === '1') {
              data.data[0].siteImg = Api.domain + '/common/readimg?imgname=' + data.data[0].siteImg
              var html = template('tempformTab', data.data[0])
              $("#body").html(html);
            }
        },
        id: id
    })
}