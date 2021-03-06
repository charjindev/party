layui.use(['form', 'layer', 'laydate', 'upload', 'table', 'laytpl'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        table = layui.table;


    //考试列表
    var tableIns = table.render({
        elem: '#examList',
        url: projectName+'/exam/queryExamList.do',
        cellMinWidth: 95,
        page: true,
        height: "full-125",
        limit: 20,
        limits: [10, 15, 20, 25],
        id: "examListTable",
        cols: [[
            {type: 'checkbox', fixed: 'left', width: 50},
            {field: 'id', title: 'ID', width: 86, align: "center", hide: true},
            {field: 'examName', title: '考试名称', width: 160, align: "center"},
            {field: 'examTime', title: '考试时长(分)', width: 120, align: "center"},
            {
                field: 'createTime',
                title: '考试创建时间',
                width: 180,
                align: "center",
                templet: "<div>{{layui.util.toDateString(d.createTime, 'yyyy-MM-dd HH:mm:ss')}}</div>"
            },
            {
                field: 'examStartTime',
                title: '开考时间',
                width: 180,
                align: "center",
                templet: "<div>{{layui.util.toDateString(d.examStartTime, 'yyyy-MM-dd HH:mm:ss')}}</div>"
            },
            {
                field: 'examEndTime',
                title: '停考时间',
                width: 180,
                align: "center",
                templet: "<div>{{layui.util.toDateString(d.examEndTime, 'yyyy-MM-dd HH:mm:ss')}}</div>"
            },
            {field: 'radioNum', title: '单选题数量', width: 110, align: 'center'},
            {field: 'radioScore', title: '(分/道)', width: 90, align: 'center'},
            {field: 'checkNum', title: '多选题数量', width: 110, align: 'center'},
            {field: 'checkScore', title: '(分/道)', width: 90, align: 'center'},
            {field: 'judgeNum', title: '判断题数量', width: 110, align: 'center'},
            {field: 'judgeScore', title: '(分/道)', width: 90, align: 'center'},
            {field: 'fillNum', title: '填空题数量', width: 110, align: 'center'},
            {field: 'fillScore', title: '(分/道)', width: 90, align: 'center'},
            {field: 'saqNum', title: '简答题数量', width: 110, align: 'center'},
            {field: 'saqScore', title: '(分/道)', width: 90, align: 'center'},
            {field: 'passScore', title: '及格分数', width: 86, align: 'center'},
            {
                field: 'openOrClose', title: '开闭卷', width: 180, align: 'center', templet: function (data) {
                    if (data.openOrClose == 0)
                        return "闭卷";
                    else
                        return "开卷";
                }
            },
            {
                field: 'isMakeup', title: '是否允许补考', width: 180, align: 'center', templet: function (data) {
                    if (data.isMakeup == 0)
                        return "否";
                    else
                        return "是";

                }
            },
            {
                title: '操作', width: 210, fixed: "right", align: "center", templet: function (data) {

                    if (data.examStartTime > data.examEndTime) {
                        var flag = 0;
                    } else {
                        var flag = 1;
                    }

                    if ((data.examStartTime <= (new Date()).getTime()) && ((new Date()).getTime() <= data.examEndTime)) {
                        return "        <input  name=" + flag + "  id=\"openOrCloseExam" + data.id + "\" check=\"true\" checked type=\"checkbox\"  lay-skin=\"switch\" lay-filter=\"filter\" lay-text=\"开启|关闭\">\n" +
                            "        <a class=\"layui-btn layui-btn-xs\"  id=\"edit" + data.id + "\">编辑</a>\n" +
                            "        <a class=\"layui-btn layui-btn-xs layui-btn-danger\"  id=\"del" + data.id + "\">删除</a>"
                    } else {
                        return "        <input  name=" + flag + " id=\"openOrCloseExam" + data.id + "\" check=\"false\" type=\"checkbox\"  lay-skin=\"switch\" lay-filter=\"filter\" lay-text=\"开启|关闭\">\n" +
                            "        <a class=\"layui-btn layui-btn-xs\" lay-event=\"edit\" id=\"edit" + data.id + "\">编辑</a>\n" +
                            "        <a class=\"layui-btn layui-btn-xs layui-btn-danger\" lay-event=\"del\" id=\"del" + data.id + "\">删除</a>"
                    }

                }
            }
        ]]
    });

    form.render('checkbox', 'examList');


    //搜索
    $(".search_btn").on("click", function () {
        var field = $(".select-retrieval-column").val(),
            value = $(".searchVal").val();
        if (field !== '' && value !== '') {
            table.reload("examListTable", {

                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    field: field, //the name of field searched in database.
                    value: value  //搜索的关键字*/
                }
            })
        } else if (field === '') {
            layer.msg("请选择检索列");
        } else {
            layer.msg("请输入搜索内容");
        }
    });

    $(".remove_retrieval_btn").click(function () {
        $(".searchVal").val('');
        // $(".select-retrieval-column").options[0].selected(true);
        table.reload("examListTable", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                field: ''   //set field as '' to avoid error to retrieve data in db.
            }
        })
    });

    //本模块暂时不需要上传功能(省去)


    $(".addNews_btn").click(function () {
        addNews();
    });

    //添加和修改考试信息
    function addNews(original_data) {
        var index = layui.layer.open({
            title: "添加考试",
            type: 2,
            area: ['100%', '100%'],
            fixed: false,
            content: "examAdd.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (original_data) {
                    body.find(".id").val(original_data.id);
                    body.find(".examName").val(original_data.examName);
                    body.find(".examTime").val(original_data.examTime);
                    body.find(".examStartTime").val(layui.util.toDateString(original_data.examStartTime, 'yyyy-MM-dd HH:mm:ss'));
                    body.find(".examEndTime").val(layui.util.toDateString(original_data.examEndTime, 'yyyy-MM-dd HH:mm:ss'));
                    body.find(".examTimeRange").val(layui.util.toDateString(original_data.examStartTime, 'yyyy-MM-dd HH:mm:ss') + " - " + layui.util.toDateString(original_data.examEndTime, 'yyyy-MM-dd HH:mm:ss'));
                    body.find(".radioNum").val(original_data.radioNum);
                    body.find(".radioScore").val(original_data.radioScore);
                    body.find(".checkNum").val(original_data.checkNum);
                    body.find(".checkScore").val(original_data.checkScore);
                    body.find(".judgeNum").val(original_data.judgeNum);
                    body.find(".judgeScore").val(original_data.judgeScore);
                    body.find(".fillNum").val(original_data.fillNum);
                    body.find(".fillScore").val(original_data.fillScore);
                    body.find(".passScore").val(original_data.passScore);
                    body.find(".openOrClose").val(original_data.openOrClose);
                    body.find(".isMakeup").val(original_data.isMakeup);

                    form.render();
                }
                setTimeout(function () {
                    layui.layer.tips('点击此处返回考试列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        });
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
        })
    }


    //批量删除
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('examListTable'),
            data = checkStatus.data,
            examId = [];
        if (data.length > 0) {
            for (var i in data) {
                examId.push(data[i].id);
            }
            layer.confirm('确定删除选中的考试吗？', {icon: 3, title: '提示信息'}, function (index) {
                $.post(projectName+"/exam/deleteExam-multiple.do", {
                    examId: examId  //将需要删除的stuNo作为参数传入
                }, function (data) {
                    layer.msg(JSON.parse(data)['msg']);     //"删除成功!" or "清空成功!" from backend.
                    tableIns.reload();
                    layer.close(index);
                });
            });
        } else {
            layer.msg("请选择需要删除的考试");
        }
    });

    //清空所有考试
    $(".clearAllexam_btn").click(function () {
        layer.confirm('确认清空此考试列表吗?', {icon: 3, title: '提示信息'}, function (index) {
            $.post(projectName+"/exam/clear.do", function (data) {
                layer.msg(JSON.parse(data)['msg']);     //"清空成功!" from backend.
                tableIns.reload();
                layer.close(index);
            });
        });
    });

    //列表操作
    table.on('tool(examList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        form.render('checkbox', 'examList');

        if (layEvent === 'edit') { //编辑
            addNews(data);
        } else if (layEvent === 'del') { //删除
            layer.confirm('确定删除此考试？', {icon: 3, title: '提示信息'}, function (index) {
                $.post(projectName+"/exam/deleteExam.do", {
                    examId: data.id  //将需要删除的考试id作为参数传入
                }, function (data) {
                    tableIns.reload();
                    layer.close(index);
                    layer.msg("删除成功");

                })
            });
        }


    });

    //监听开启考试开关按钮
    form.on('switch(filter)', function (data0) {

        console.log(data0.elem.name);
        console.log(data0);
        // console.log(data0.elem.id + ":id   type:" + typeof data0.elem.id); //得到checkbox原始DOM对象
        // console.log("点击时：" + data0.elem.checked); //开关是否开启，true或者false
        var str = new String();
        var arr = new Array();

        //可以用字符或字符串分割
        arr = (data0.elem.id).split('m');
        console.log("8888888888888888:" + arr[1]);
        var id = parseInt(arr[1]);
        var x = data0.elem.checked;

        if (data0.elem.checked) {
            //验证此时加入的时间段是否与数据库中各个考试的时间段冲突，冲突则禁止加入！
            $.ajax({
                type: "post",
                url: projectName+"/exam/queryAppointTimeQuantumById.do",
                data: {id: id},
                dataType: "json",
                success: function (data2) {
                    if (data2.status === 200) {
                        $.ajax({
                            url: projectName+"/exam/updateStartTime.do",
                            type: "post",
                            data: {id: id},
                            dataType: "json",
                            success: function (data3) {
                                if (data0.elem.name == 0) {
                                    layer.msg("时间错乱，请点击编辑修改考试时间！！！", {time: 1000});
                                } else {
                                    if (data3.status === 200) {
                                        layer.msg("考试开启成功！", {icon: 6});
                                        /* $("#2args").attr("disabled",'disabled');*/
                                        $("#" + "edit" + id).removeAttr("lay-event");
                                        $("#" + "del" + id).removeAttr("lay-event");
                                        /*  $("#"+"edit"+data.id).click(function() {
                                              layer.msg("考试时间段内，不允许对当堂考试进行编辑！", {
                                                       time: 2000, //2s后自动关闭
                                               });
                                          });
                                          $("#"+"del"+data.id).click(function() {
                                              layer.msg("考试时间段内，不允许对当堂考试进行删除！", {
                                                  time: 2000, //2s后自动关闭
                                              });
                                          });*/
                                        table.reload("examListTable", {
                                            page: {
                                                curr: 1 //重新从第 1 页开始
                                            },
                                            where: {
                                                field: ''   //set field as '' to avoid error to retrieve data in db.
                                            }
                                        });
                                        data0.elem.checked = true;
                                        form.render();
                                        console.log("点击后（开启成功）：" + data0.elem.checked); //开关是否开启，true或者false

                                    } else if (data3.status === 500) {
                                        data0.elem.checked = false;
                                        form.render();
                                        layer.msg("开启失败！", {icon: 5});
                                    }
                                }
                                form.render();

                            }


                        });
                    } else if (data2.status === 500) {

                        layer.msg("此时间段与数据库中某个时间段冲突！考试开启失败！", {icon: 5});
                        table.reload("examListTable", {
                            page: {
                                curr: 1 //重新从第 1 页开始
                            },
                            where: {
                                field: ''   //set field as '' to avoid error to retrieve data in db.
                            }
                        });
                        data0.elem.checked = false;
                        form.render();
                        console.log("点击后（开启失败）：" + data0.elem.checked); //开关是否开启，true或者false

                    } else if (parseInt(data2) === -1) {
                        data0.elem.checked = false;
                        form.render();
                        layer.msg("时间段为空！请重新选择", {icon: 5});
                    }
                    console.log("reload1");
                    location.reload();
                },
                fail: function (data2) {
                    data0.elem.checked = false;
                    form.render();
                    layer.msg("失败");

                },
                error: function (data2) {
                    data0.elem.checked = false;
                    form.render();
                    layer.msg("错误");
                }

            });

        } else {

            $.ajax({
                url: projectName+"/exam/updateEndTime.do",
                type: "post",
                data: {id: id},
                dataType: "json",
                success: function (data3) {
                    console.log(data3.status + " leixing:" + typeof data3.status);
                    if (data3.status === 200) {

                        layer.msg("考试关闭成功！", {icon: 6});
                        $("#" + "edit" + id).attr("lay-event", "edit");
                        $("#" + "del" + id).attr("lay-event", "del");

                        table.reload("examListTable", {
                            page: {
                                curr: 1 //重新从第 1 页开始
                            },
                            where: {
                                field: ''   //set field as '' to avoid error to retrieve data in db.
                            }
                        });
                        data0.elem.checked = false;
                        form.render();
                        console.log("点击后（关闭成功）：" + data0.elem.checked); //开关是否开启，true或者false


                    } else {
                        data0.elem.checked = true;
                        form.render();
                        layer.msg("关闭失败！", {icon: 5});
                    }

                }
            });

        }


        /*      var x=data0.elem.checked;
              layer.open({
                  content: 'test'
                  ,btn: ['确定', '取消']
                  ,yes: function(index, layero){
                      data0.elem.checked=x;
                      form.render();
                      layer.close(index);
                      //按钮【按钮一】的回调
                  }
                  ,btn2: function(index, layero){
                      //按钮【按钮二】的回调
                      data0.elem.checked=!x;
                      form.render();
                      layer.close(index);
                      //return false 开启该代码可禁止点击该按钮关闭
                  }
                  ,cancel: function(){
                      //右上角关闭回调
                      data0.elem.checked=!x;
                      form.render();
                      //return false 开启该代码可禁止点击该按钮关闭
                  }
              });*/
        /* return false;*/
    });

});