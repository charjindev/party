package cn.edu.cdcas.partyschool.service;

import cn.edu.cdcas.partyschool.model.Exam;

public interface ExamService {
    int selectState() throws Exception;
    int insertSelective(Exam exam) throws Exception;
    int deleteById(Integer id) throws Exception;
    int updateByIdSelective(Exam exam) throws Exception;
    Exam queryById(Integer id) throws Exception;
}