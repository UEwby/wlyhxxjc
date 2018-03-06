$(function () {
    $(".header-wrap .nav li").eq(0).addClass('active');

    $("#txtkey").focus(function () {
        var key = $(this).val();
        if (key === '请输入您想查询的关键字') {
            $(this).val('');
        }
    }).blur(function () {
        var key = $(this).val();
        if (key === '') {
            $(this).val('请输入您想查询的关键字');
        }
    });

    //, keywordsCloud .icon-rilijiantouzuoshuang
    $(document).on('click', '.data .icon-rilijiantouzuoshuang,.keywordsCloud .icon-rilijiantouzuoshuang', function () {
        var min = $(this).parents('.window-item-group').find('.min-state');
        $(this).parents('.window-item').animate({width: 'hide'}, 200, function () {
            $(min).show();
        });
    });
    $(document).on('click', '.data .icon-rilijiantouyoushuang,.keywordsCloud .icon-rilijiantouyoushuang', function () {
        var item = $(this).parents('.window-item-group').find('.window-item');
        $(this).parents('.min-state').hide();
        item.animate({width: 'show'}, 200);
    });
    $(document).on('click', '.chartInfo .icon-rilijiantouyoushuang,.dongtai .icon-rilijiantouyoushuang', function () {
        var min = $(this).parents('.window-item-group').find('.min-state');
        $(this).parents('.window-item').animate({width: 'hide'}, 200, function () {
            $(min).show();
        });
    });
    $(document).on('click', '.chartInfo .icon-rilijiantouzuoshuang,.dongtai .icon-rilijiantouzuoshuang', function () {
        var item = $(this).parents('.window-item-group').find('.window-item');
        $(this).parents('.min-state').hide();
        item.animate({width: 'show'}, 200);
    });

    $(document).on('mouseenter', '.month-day', function () {
        $(this).find('.item-tips').fadeIn(200);
    }).on('mouseleave', '.month-day', function () {
        $(this).find('.item-tips').fadeOut(200);
    });

    // 查询
    $('#btnGoSearch').on('click', function () {
        var txt = $('#txtkey').val();
        if (txt && txt != '请输入您想查询的关键字') {
            location.href = './query.html?key=' + txt;
        }
    })

    // 词云
    function initKeyWordCloud() {
        Api.ajax({
            url: '/keyword/couldlist?count=20',
            success: function (data) {
                if (data.result === '1') {
                    var html = '';
                    $.each(data.data, function (i, obj) {
                        html += '<a href="#">' + obj.text + '</a>';
                    });
                    $("#tags").html(html);
                    initKeyWordCloud3D();
                }
            }
        })
    }

    // 词云 动画
    function initKeyWordCloud3D() {
        try {
            var i, et = document.getElementById('tags').childNodes;
            for (i in et) {
                et[i].nodeName == 'A' && et[i].addEventListener('click', function (e) {
                    e.preventDefault();
                });
            }

            TagCanvas.Start('myCanvas', 'tags', {
                textColour: '#fff',
                outlineColour: 'rgba(23, 125, 241, 0)',
                reverse: true,
                depth: 0.8,
                dragControl: false,
                decel: 0.95,
                maxSpeed: 0.05,
                initial: [-0.2, 0]
            });
        } catch (e) {
        }
    }

    // 图表
    function initEchart() {
        var option = {
            color: ['#ffd929', '#045eff', '#ff7100', '#0463ff', '#ff7f00'],
            tooltip: {
                show: true,
                trigger: 'axis',
                borderColor: '#313948',
                borderWidth: 1,
                axisPointer: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                backgroundColor: 'rgba(90,97,112,0.9)',
            },
            series: [
                {
                    name: '网络有害信息占比',
                    type: 'pie',
                    center: ['46%', '50%'],
                    radius: ['45%', '65%'],
                    label: {
                        normal: {
                            position: 'outside',
                            show: true,
                            formatter: "{b}\n\n{d}%",
                            //formatter: "{b}",
                            textStyle: {
                                fontSize: 14,
                                color: "#fff",
                            },
                        }
                    },
                    labelLine: {
                        normal: {
                            textStyle: {
                                fontSize: 14
                            },
                            length: 20,
                            length2: 15,
                            lineStyle: {
                                width: 1
                            }
                        }
                    },
                    data: []
                }
            ]
        };
        Api.ajax({
            url: '/data/ratio',
            success: function (data) {
                if (data.result === '1') {
                    $.each(data.data, function (index, obj) {
                        //console.log(typeof option.series[].data);
                        option.series[0].data.push({value: obj.dataCount, name: obj.typeName})
                    });
                    var myChart = echarts.init(document.getElementById('chartmain'));
                    myChart.setOption(option);
                }
            }
        })
    }

    // 监测动态数据
    function addTrendsData(page) {
        page = page || 1;
        Api.ajax({
            url: '/data/dynamic?count=' + page,
            success: function (data) {
                if (data.result === '1') {
                    var html = '';
                    $.each(data.data, function (i, obj) {
                        html += '<li class="hide">' + obj.url + '<span>' + obj.siteAddr + '</span></li>';
                    });
                    $('#site-list-content').prepend(html);
                    $('#site-list-content .hide').animate({height: 'show'}, 200);
                    setTimeout(function () {
                        addTrendsData(1);
                    }, 5000);
                }
            }
        })
    }

    // 监测晴雨表
    function initDataTimeData() {
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        myDate = new Date(year + '-' + month);
        var xingqi = myDate.getDay();
        var pianyi = xingqi == 0 ? 6 : xingqi - 1;
        $('#currMonth').html(year + '年 ' + month + '月');
        Api.ajax({
            url: '/data/date?year=' + year + '&month=' + month,
            success: function (data) {
                if (data.result === '1') {
                    console.log(data);
                    var list = $('.month-day-list .item');
                    for (var i = 0; i < pianyi; i++) {
                        //list.eq(i).html(html);
                    }
                    for (var i = 0; i < data.data.length; i++) {
                        var obj = data.data[i];
                        var typeClass = obj.desc_type == 1 ? "" : (obj.desc_type == 2 ? "normal" : "bad");
                        var html = '<span class="day">' + obj.day + '</span>';
                        if (obj.desc_type != 0) {
                            html += '<span class="icon ' + typeClass + '"></span>';
                            html += '<div class="item-tips">有害信息检测到<span class="red">' + obj.dataCount + '</span>条</div>';
                        }
                        else {
                            html += '<div class="item-tips" style="width:60px">暂无数据</div>';
                        }
                        // 选中当天
                        if (day == i + 1) {
                            list.eq(i + pianyi).addClass('active');
                        }
                        list.eq(i + pianyi).addClass('month-day').html(html);
                    }
                }
            }
        })

    }

    initKeyWordCloud();
    initEchart();
    addTrendsData(8);
    initDataTimeData();
});