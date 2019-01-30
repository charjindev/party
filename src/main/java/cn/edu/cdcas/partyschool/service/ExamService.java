package cn.edu.cdcas.partyschool.service;

import cn.edu.cdcas.partyschool.model.Exam;

import java.util.List;
import java.util.Map;

public interface ExamService {

    int queryAllExamRows();
    Map<String, Object> queryAllExamList(int start, int pageSize);
    int selectState() throws Exception;
    int insertSelective(Exam exam) throws Exception;
    int deleteById(Integer id) throws Exception;
    int updateByIdSelective(Exam exam) throws Exception;
    Exam queryById(Integer id) throws Exception;
}
