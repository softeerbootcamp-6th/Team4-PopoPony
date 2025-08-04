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
    public Patient register(RecruitCreateRequest request) {

        Patient patient = Patient.builder()
                .latestLocation(null)
                .name(request.getName())
                .imageUrl(null)
                .age(request.getAge())
                .gender(request.getGender())
                .contact(request.getPhoneNumber())
                .needsHelping(request.isNeedsHelping())
                .usesWheelchair(request.isUsesWheelchair())
                .hasCognitiveIssue(request.isHasCognitiveIssue())
                .cognitiveIssueDetail(request.getCognitiveIssueDetail())
                .hasCommunicationIssue(request.isHasCommunicationIssue())
                .communicationIssueDetail(request.getCommunicationIssueDetail())
                .build();

        return patientJpaRepository.save(patient);
    }

    public Optional<Patient> findPatientById(Long patientId) {
        return patientJpaRepository.findById(patientId);
    }
}
