package cn.edu.cdcas.partyschool.controller;

import cn.edu.cdcas.partyschool.service.UserService;
import cn.edu.cdcas.partyschool.util.JSONResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/examinee")
public class ExamineeController {

    @Autowired
    private UserService userServiceImpl;
    /**
     *@Describe: 考生点击开始考试/补考到考试页面，获取随机到的题目id写入session
     *@Author Snail
     *@Date 2019/3/5
     */
    @RequestMapping("/allQuestionInfoForStu")
    @ResponseBody
    /*@Transactional(rollbackFor =Exception.class )*/
    public Map<String,Object> allQuestionInfoForStu(HttpSession httpSession){
        Map<String,Object> requiredQuestions=new HashMap<>();
        try {
            //更新exam_state,开考时间
            int examState= (int) httpSession.getAttribute("examState");
            int nowExamState=userServiceImpl.changeExamState((String) httpSession.getAttribute("studentNo"),examState);
            httpSession.setAttribute("examState",nowExamState);
            //封装需要的数据
            requiredQuestions=userServiceImpl.requiredQuestionAndOther(httpSession);

            return requiredQuestions;
        } catch (Exception e) {
            e.printStackTrace();
            requiredQuestions.put("status",500);
            requiredQuestions.put("msg","----------考生考试状态异常！！---------");
            return requiredQuestions;
        }
    }

    @RequestMapping("/examAndStuInfo")
    @ResponseBody
    public  Map<String, Object> studentExamInfo(HttpSession httpSession){
//         ((UserSession) httpSession.getAttribute("partySys_user")).getNumber();
        String  studentNo= (String) httpSession.getAttribute("studentNo");
        Map<String,Object> studentExamInfo=null;
        try {
            studentExamInfo = userServiceImpl.studentExamInfo(studentNo);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return studentExamInfo;
    }

    /**
     *@Describe: update数据，注意isMakeUp字段
     *@Author Snail
     *@Date 2019/3/9
     */
    @RequestMapping("/updateByQueId")
    @ResponseBody
    public JSONResult updateByQueId(int id,String answer,HttpSession httpSession){
        try {
            boolean b =userServiceImpl.saveAnswer(id, answer,String.valueOf(httpSession.getAttribute("studentNo")),"1".equals(String.valueOf(httpSession.getAttribute("examState")))?"0":"1");
            return new JSONResult(0,"",200);
        } catch (Exception e) {
            e.printStackTrace();
            return new JSONResult(-1,"更新失败",500);
        }
    }
    /**
     *@Describe: 交卷,按情况更新考试结束时间,考试总分的结算,exam_sate状态的更新,删除session中的题号
     *@Author Snail
     *@Date 2019/3/11
     */
    @RequestMapping("/updateEndTime")
    @ResponseBody
    public boolean updateEndTime(HttpSession httpSession){
        try {
            userServiceImpl.changeExamEnd((String) httpSession.getAttribute("studentNo"), (Integer) httpSession.getAttribute("examState"));
//            userServiceImpl.updateScoreAndExamState((String)httpSession.getAttribute("studentNo"),"1".equals((String)httpSession.getAttribute("examState"))?"0":"1");
            httpSession.removeAttribute("dan");
            httpSession.removeAttribute("duo");
            httpSession.removeAttribute("pan");
            httpSession.removeAttribute("tian");
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    /**
     *@Describe: 分数获取页面
     *@Author Snail
     *@Date 2019/3/13
     */
    @RequestMapping("/getScore")
    @ResponseBody
    public Map<String, Object> getScoreAndIsMakeUp(HttpSession httpSession){
        Map<String,Object> scoreInfo=new HashMap<>();
        try {
            String studentNo = (String) httpSession.getAttribute("studentNo");
            scoreInfo=userServiceImpl.getScoreAndIsMakeUpMap(studentNo);
            scoreInfo.put("studentNo",studentNo);
            scoreInfo.put("studentName",userServiceImpl.queryByStuNo(studentNo).getName());
            return scoreInfo;
        } catch (Exception e) {
            e.printStackTrace();
            scoreInfo.put("code",-1);
            return scoreInfo;
        }
    }
    /**
     *@Describe: 获取当前时间
     *@Author Snail
     *@Date 2019/3/21
     */
    @RequestMapping("/currentTime")
    @ResponseBody
    public String getCurrentTime(){
        return String.valueOf(System.currentTimeMillis());
    }
}
