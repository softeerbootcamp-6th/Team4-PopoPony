package com.todoc.server.domain.customer.service;

import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.customer.repository.PatientRepository;
import com.todoc.server.domain.escort.web.dto.request.RecruitCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final PatientRepository patientJpaRepository;

    // 여기에 환자 관련 서비스 메서드를 추가할 수 있습니다.
    // 예: 환자 등록, 조회, 수정, 삭제 등

    // 예시 메서드
    public Patient register(RecruitCreateRequest.PatientDetail patientDetail) {

        // 환자 정보를 Patient 엔티티로 변환하고 저장
        Patient patient = Patient.builder()
                .latestLocation(null)
                .name(patientDetail.getName())
                .imageUrl(null)
                .age(patientDetail.getAge())
                .gender(patientDetail.getGender())
                .contact(patientDetail.getPhoneNumber())
                .needsHelping(patientDetail.isNeedsHelping())
                .usesWheelchair(patientDetail.isUsesWheelchair())
                .hasCognitiveIssue(patientDetail.isHasCognitiveIssue())
                .cognitiveIssueDetail(patientDetail.getCognitiveIssueDetail())
                .hasCommunicationIssue(patientDetail.isHasCommunicationIssue())
                .communicationIssueDetail(patientDetail.getCommunicationIssueDetail())
                .build();

        return patientJpaRepository.save(patient);
    }

    public Optional<Patient> findPatientById(Long patientId) {
        return patientJpaRepository.findById(patientId);
    }
}
