layui.use(['form','layer','layedit','laydate','upload'],function(){
    var form = layui.form,
    layer = parent.layer === undefined ? layui.layer : top.layer,
        laypage = layui.laypage,
        upload = layui.upload,
        layedit = layui.layedit,
        laydate = layui.laydate,
        $ = layui.jquery;
        $('.submit-btn-submit').css({"left":"-32px","margin-left":"50%"});
        console.log($('.passScore').css('width'));
        $('.examTimeRange').css("width",$('.passScore').css('width'));
        $('.label-zongfen').css("font-size","17px");
        $('.label-fen').css("font-size","17px");
        $('.examAllScore').css({"color":"blue","font-size":"19px"});
      /*  console.log("1111111111111111111111111:"+$("input:hidden[name='id']").val());
         console.log("2222222222222222222222:"+$("input:text[name='id']").val());*/



        /*根据所选时间段计算出该时间段的分差值*/
       /* function TimeDifference(startTime,endTime)
        {
            //定义两个变量time1,time2分别保存开始和结束时间
            var startTime=startTime;
            var endTime=endTime;
            //判断开始时间是否大于结束日期
            if(startTime>endTime)
            {
                layui.alert("开始时间不能大于结束时间！",{icon: 5});
                return false;
            }
            //截取字符串，得到日期部分"2009-12-02",用split把字符串分隔成数组
            var begin1=startTime.substr(0,10).split("-");
            var end1=endTime.substr(0,10).split("-");
            //将拆分的数组重新组合，并实例成化新的日期对象
            var date1=new Date(begin1[1] + - + begin1[2] + - + begin1[0]);
            var date2=new Date(end1[1] + - + end1[2] + - + end1[0]);
            //得到两个日期之间的差值m，以分钟为单位
            //Math.abs(date2-date1)计算出以毫秒为单位的差值
            //Math.abs(date2-date1)/1000得到以秒为单位的差值
            //Math.abs(date2-date1)/1000/60得到以分钟为单位的差值
            var m=parseInt(Math.abs(date2-date1)/1000/60);
            //小时数和分钟数相加得到总的分钟数
            //startTime.substr(11,2)截取字符串得到时间的小时数
            //parseInt(startTime.substr(11,2))*60把小时数转化成为分钟
            var min1=parseInt(startTime.substr(11,2))*60+parseInt(startTime.substr(14,2));
            var min2=parseInt(endTime.substr(11,2))*60+parseInt(endTime.substr(14,2));
            //两个分钟数相减得到时间部分的差值，以分钟为单位
            var n=min2-min1;
            //将日期和时间两个部分计算出来的差值相加，即得到两个时间相减后的分钟数
            var minutes=m+n;
            return minutes;
        }*/

        /*计算总分通过各个文本框中值的求和计算*/
        function sum(ob){
        var radioNum = parseInt($('.radioNum').val());
        var radioScore = parseInt($('.radioScore').val());
        var radio=0;

        var checkNum = parseInt($('.checkNum').val());
        var checkScore = parseInt($('.checkScore').val());
        var check = 0;

        var judgeNum = parseInt($('.judgeNum').val());
        var judgeScore = parseInt($('.judgeScore').val());
        var judge = 0;

        var fillNum = parseInt($('.fillNum').val());
        var fillScore = parseInt($('.fillScore').val());
        var fill = 0;

        if((radioNum!=''&&radioScore!='')&&(!(isNaN(radioNum)||isNaN(radioScore)))){
            radio = radioNum * radioScore;
        }else{radioNum=0;radioScore=0;}

        if((checkNum!=''&&checkScore!='')&&(!(isNaN(checkNum)||isNaN(checkScore)))){
            check = checkNum * checkScore;
        }else{checkNum=0;checkScore=0;}

        if((judgeNum!=''&&judgeScore!='')&&(!(isNaN(judgeNum)||isNaN(judgeScore)))){
            judge = judgeNum * judgeScore;
        }else{judgeNum=0;judgeScore=0;}

        if((fillNum!=''&&fillScore!='')&&(!(isNaN(fillNum)||isNaN(fillScore)))){
            fill = fillNum * fillScore;
        }else{fillNum=0;fillScore=0;}
        var allScore = 0;
        if(radio!==''&&check!==''&&judge!==''&&fill!==''){
            allScore =  radio + check + judge + fill;
        }
        $('.examAllScore').text(allScore);
        return allScore;
    }

        /*jQuery控制文本框只能输入数字[兼容IE、火狐等浏览器]*/
        $.fn.numeral=function(bl){//限制分数输入、兼容浏览器、屏蔽粘贴拖拽等
        $(this).keypress(function(e){
            var keyCode=e.keyCode?e.keyCode:e.which;
            if(bl){//浮点数
                if((this.value.length==0 || this.value.indexOf(".")!=-1) && keyCode==46) return false;
                return keyCode>=48&&keyCode<=57||keyCode==46||keyCode==8;
            }else{//整数
                return  keyCode>=48&&keyCode<=57||keyCode==8;
            }
        });
        $(this).bind("copy cut paste", function (e) { // 通过空格连续添加复制、剪切、粘贴事件
            if (window.clipboardData)//clipboardData.setData('text', clipboardData.getData('text').replace(/\D/g, ''));
                return !clipboardData.getData('text').match(/\D/);
            else
                event.preventDefault();
        });
        $(this).bind("dragenter",function(){return false;});
        $(this).css("ime-mode","disabled");
        $(this).bind("focus", function() {
            if (this.value.lastIndexOf(".") == (this.value.length - 1)) {
                this.value = this.value.substr(0, this.value.length - 1);
            } else if (isNaN(this.value)) {
                this.value = "";
            }
        });
    }


        /*引入jQuery-3.1后以下办法不能初始化（在谷歌浏览器）文本框，改用定时器处理*/
    /* $('.examAllScore').text(sumAndvalidate());*/
        window.setTimeout(sum,500);
        /*为需要参与计算总分的文本框设置键盘按键监听事件*/
        $(".radioNum,.radioScore,.checkNum,.checkScore,.judgeNum,.judgeScore,.fillScore,.fillNum").keyup(sum);


        $(".radioNum,.radioScore,.checkNum,.checkScore,.judgeNum,.judgeScore,.fillScore,.fillNum,.passScore,.examTime").numeral(false);//限制只能输入整数




    /* alert($('.examAllScore').text());*/
        //日期时间范围
        laydate.render({
            elem: '#examTimeRangeId'
            ,type: 'datetime'
            ,range: true
            ,done: function(value, date, endDate){
              /*  console.log(value); //得到日期生成的值，如：2017-08-18
                console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。*/
                var str=new String();
                var arr=new Array();
                var examId = parseInt($("input:text[name='id']").val()) ;
               /* console.log("testtest 类型："+typeof examId +"  value:" + examId);*/


                //可以用字符或字符串分割
                arr=value.split(' - ');

                var laydate = layui.laydate;
                //日期时间选择器
                laydate.render({
                    elem: '#examStartTimeId'
                    , type: 'datetime'
                    ,format: 'yyyy-MM-dd HH:mm:ss'
                    ,value:arr[0]
                });
                //日期时间选择器
                laydate.render({
                    elem: '#examEndTimeId'
                    , type: 'datetime'
                    ,format: 'yyyy-MM-dd HH:mm:ss'
                    ,value:arr[1]
                });
                console.log($('.examStartTime').val());
                console.log($('.examEndTime').val());
            /*    alert($('.examEndTime').val());*/
                //验证此时加入的时间段是否与数据库中各个考试的时间段冲突，冲突则禁止加入！

                //为空（说明为新增）则加入
                if(isNaN(examId)){
                    $.ajax({
                        url : projectName+"/exam/queryAppointTimeQuantum.do",
                        type : "post",
                        data:{examStartTime:arr[0],examEndTime:arr[1],id:-1},
                        dataType: "text",
                        success : function(data){
                            if(parseInt(data)===0) {
                                /*layer.alert("此时间段无考试，时间段已加入！");*/
                            }
                            else if(parseInt(data)>0){
                                $('.examTimeRange').val("");
                                $('.examStartTime').val("");
                                $('.examEndTime').val("");
                                layer.alert("此时间段与数据库中某个时间段冲突！请重新选择",{icon: 5});
                            }
                            else if(parseInt(data)===-1){
                                $('.examTimeRange').val("");
                                $('.examStartTime').val("");
                                $('.examEndTime').val("");
                                layer.alert("时间段为空！请重新选择",{icon: 5});
                            }
                        },
                        fail:function(data){
                            $('.examTimeRange').val("");
                            $('.examStartTime').val("");
                            $('.examEndTime').val("");
                            layer.msg("失败");
                        },
                        error: function (data) {
                            $('.examTimeRange').val("");
                            $('.examStartTime').val("");
                            $('.examEndTime').val("");
                            layer.msg("错误");
                        }

                    });
                }else{
                    $.ajax({
                        url : projectName+"/exam/queryAppointTimeQuantum.do",
                        type : "post",
                        data:{id:examId,examStartTime:arr[0],examEndTime:arr[1]},
                        dataType: "text",
                        success : function(data){
                            if(parseInt(data)===0) {
                                /*layer.alert("此时间段无考试，时间段已修改！");*/
                            }
                            else if(parseInt(data)>0){
                                $('.examTimeRange').val("");
                                $('.examStartTime').val("");
                                $('.examEndTime').val("");
                                layer.alert("此时间段与数据库中某个时间段冲突！请重新选择",{icon: 5});
                            }
                            else if(parseInt(data)===-1){
                                $('.examTime').val("");
                                layer.alert("时间段为空！请重新选择",{icon: 5});
                            }
                        },
                        fail:function(data){
                            $('.examTimeRange').val("");
                            $('.examStartTime').val("");
                            $('.examEndTime').val("");
                            layer.msg("失败");
                        },
                        error: function (data) {
                            $('.examTimeRange').val("");
                            $('.examStartTime').val("");
                            $('.examEndTime').val("");
                            layer.msg("错误");
                        }

                    });
                }



            }
        });

        //监听提交
        form.on('submit(signAdd)', function (data) {
            // console.log(data.field);
            // return;
            //signAdd为提交按钮的id

            $.post(projectName+"/exam/add-update.do", data.field,
                function (data) {
                    if (data.status === 200) {
                        layer.msg(data['msg']);
                        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                        parent.layer.close(index); // 关闭layer
                        //使父页面重新刷新
                        parent.location.reload();
                    } else {
                        layer.msg("添加失败");
                        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                        parent.layer.close(index); // 关闭layer
                    }
                }, "json");
            return false;
        });



})




