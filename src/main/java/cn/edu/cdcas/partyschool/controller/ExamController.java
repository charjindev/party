package cn.edu.cdcas.partyschool.controller;

import cn.edu.cdcas.partyschool.listener.UniqueSession;
import cn.edu.cdcas.partyschool.model.Exam;
import cn.edu.cdcas.partyschool.service.ExamService;
import cn.edu.cdcas.partyschool.util.JSONResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * @Author Snail
 * @Describe about exam function
 * @CreateTime 2019/1/27
 */
@RestController
@RequestMapping("/exam")
public class ExamController {

    @Autowired
    private ExamService examService;

    /**
     * @Describe: 查找在当前时间是否存在考试
     * @Author Snail
     * @Date 2019/1/27
     */
    @RequestMapping("/haveExam")
    private JSONResult haveExam() {
        try {
            String examId = examService.isCurrentExam();
            if (examId == null) {
                return new JSONResult(0, "当前没有考试", 200);
            } else {
                return new JSONResult(1, "当前有考试", 200);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new JSONResult(3, "数据库异常！！，联系管理员", 200);
        }
    }

    /**
     * @Describe: 查询当前考试信息(将当前时间作为查询条件)
     */
    @RequestMapping("/queryCurrentExamInformation")
    private Map<String, Object> queryCurrentExamInformation() {
        Map<String, Object> map = null;
        try {
            map = examService.queryCurrentExamInformation();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return map;
    }


    /**
     * @Describe: 通过id查询
     */
    @RequestMapping("/findExamById")
    private Exam findExamById(@RequestParam("id") Integer  id) throws Exception {
        return examService.findExamById(id);
    }

    /**
     * @Describe: 新增或更新一个考试
     */
    @RequestMapping("/add-update")
    public JSONResult addStu(Exam exam) throws Exception {
        if (exam.getId() == null) { //if 'id' is null,insert a new student.
            examService.insertSelective(exam);
            return new JSONResult(0, "添加考生成功!", 200);
        }
        examService.updateByIdSelective(exam);
        return new JSONResult(0, "信息修改成功!", 200);
    }

    /**
     * @Describe: 开启考试（更新考试开考为现在,考试时长不变）
     */
   /* @RequestMapping("/updateTimeRangeById")
    public JSONResult updateTimeRangeById(Exam exam) throws Exception{
        if(exam.getId()!=null){
           examService.updateTimeRangeById(exam);
           return new JSONResult(0, "开启考试成功！", 200);
        }
        return new JSONResult(3, "开启考试失败！", 500);
    }*/
    /**
     * @Describe: 更新考试开考为现在
     */
    @RequestMapping("/updateStartTime")
    public JSONResult updateStartTime(@RequestParam("id") Integer  id) throws Exception{
        if(id>0){
            examService.updateStartTime(id);

            return new JSONResult(0, "开启考试成功！", 200);
        }
        return new JSONResult(3, "开启考试失败！", 500);
    }


    /**
     * @Describe: 更新考试停考为现在
     */
    @RequestMapping("/updateEndTime")
    public JSONResult updateEndTime(@RequestParam("id") Integer  id) {
        try {
            if(examService.updateEndTime(id)==0){
                return new JSONResult(3, "数据库修改失败，停止考试失败！", 500);
            }


            return new JSONResult(0, "停止考试成功！", 200);
        } catch (Exception e) {
            e.printStackTrace();
            return new JSONResult(3, "停止考试失败！", 500);
        }
    }

/*    @RequestMapping("/endNowExam")
    @ResponseBody
    public int endNowExam(){
        try {
            if(examService.endNowExam()){
                return 0;
            }else {
                return -1;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }*/

    /**
     * @Describe: 查询指定时间段内是否有其他考试（此版本系统同一时间段内只能有一个考试）
     */
    @RequestMapping("/queryAppointTimeQuantum")
    public int queryAppointTimeQuantum(Exam exam) throws  Exception{
        if(exam.getExamStartTime()!=null && exam.getExamEndTime()!=null){
            int result = examService.queryAppointTimeQuantum(exam);
            //result = 0(加入考试时间段与数据库没有冲突) result > 0 ：冲突
            return result;
        }
        return -1;
    }

    /**
     * @Describe: 根据id查询此id对应的时间段内是否有其他考试
     */
    @RequestMapping("/queryAppointTimeQuantumById")
    public JSONResult queryAppointTimeQuantumById(@RequestParam("id") Integer  id) throws Exception{

        int result = examService.queryAppointTimeQuantumById(id);
        if(result==0){
            return new JSONResult(0,"此时间段没其他考试",200);
        }else{
            return new JSONResult(3,"此时间段存在其他考试",500);
        }

    }


    /**
     * @Describe: 查询考试（包括有条件和无条件查询）
     */
    @RequestMapping(value = "/queryExamList", method = RequestMethod.GET)
    private Map<String, Object> queryExamList(@RequestParam(value = "page", required = false) int page, @RequestParam(value = "limit", required = false) int limit,
                                              @RequestParam(value = "field", required = false, defaultValue = "") String field, @RequestParam(value = "value", required = false, defaultValue = "") String value) {

        Map<String, Object> map = null;
        try {
            if (field.equals("")) {
                //page：防止错误的page参数
                map = examService.queryAllExamList((page - 1 < 0 ? 0 : page - 1) * limit, limit);
            } else {
                //page：防止错误的page参数
                map = examService.queryAllExamByKeyName((page - 1 < 0 ? 0 : page - 1) * limit, limit, field, value);
            }

        } catch (Exception e) {
            e.printStackTrace();
            //到异常页面，通知管理员

        }
        return map;
    }

    /**
     * @Describe: 新增一个考试（未用到）
     */
    @RequestMapping("/addExam")
    private JSONResult addExam(Exam exam) {
        try {
            int rows = examService.insertSelective(exam);
            if (rows <= 0) {
                return new JSONResult(3, "新增失败，请联系管理员", 200);
            } else {
                return new JSONResult(0, "新增成功啦！", 200);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return new JSONResult(3, "数据库异常！！，联系管理员", 200);
        }

    }

    /**
     * @Describe: 更新一个考试（未用到）
     */
    @RequestMapping("/updateExam")
    private JSONResult updateExam(Exam exam) {
        try {
            int rows = examService.updateByIdSelective(exam);
            if (rows <= 0) {
                return new JSONResult(3, "更新失败，联系管理员", 200);
            } else {
                return new JSONResult(0, "更新成功啦！", 200);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return new JSONResult(3, "数据库异常！！，联系管理员", 200);
        }
    }

    /**
     * @Describe: 删除一个考试（未用到）
     */
    @RequestMapping(value = "/deleteExam", method = RequestMethod.POST)
    private JSONResult deleteExam(@RequestParam("examId") int examId) {
        try {
            int rows = examService.deleteById(examId);
            if (rows <= 0) {
                return new JSONResult(3, "删除失败，联系管理员", 200);
            } else {
                return new JSONResult(0, "删除成功啦！", 200);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return new JSONResult(3, "数据库异常！！，联系管理员", 200);
        }
    }


    /**
     * @Describe: 查询一个考试（通过考试名字）（未用到）
     */
    @RequestMapping("/queryExamByName")
    private Map<String, Object> queryExamByName(@RequestParam(required = false, defaultValue = "1") int page, @RequestParam(required = false, defaultValue = "15") int pageSize, String examName) {
        Map<String, Object> map = null;
        try {
            //page：防止错误的page参数
            map = examService.queryExamByName(page - 1 < 0 ? 0 : page - 1, pageSize, examName);
        } catch (Exception e) {
            e.printStackTrace();
            //到异常页面，通知管理员

        }
        return map;
    }

    /**
     * @Describe: 清空(删除)考试表
     */
    @RequestMapping(value = "/clear", method = RequestMethod.POST)
    public JSONResult clear() throws Exception {
        examService.clear();
        return new JSONResult(0, "清空成功!", 200);
    }


    /**
     * @Describe: 批量删除
     */
    @RequestMapping(value = "/deleteExam-multiple", method = RequestMethod.POST)
    public JSONResult deleteMultipleExam(@RequestParam("examId[]") int[] examId) throws Exception {
        for (int examid : examId) examService.deleteById(examid);
        return new JSONResult(0, "已删除所选考试!", 200);
    }

    //获取当前考生人数
    @RequestMapping("/studentSize")
    public int studentSize() throws Exception {
        return UniqueSession.sessionMap.size();
    }

}
