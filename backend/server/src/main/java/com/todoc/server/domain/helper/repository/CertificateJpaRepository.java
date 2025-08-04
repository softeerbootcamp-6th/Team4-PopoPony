package com.todoc.server.domain.helper.repository;

import com.todoc.server.domain.helper.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CertificateJpaRepository extends JpaRepository<Certificate, Long> {

    @Query(value = "SELECT type FROM certificate WHERE helper_id = :helperId", nativeQuery = true)
    List<String> findTypesByHelperId(@Param("helperId") Long helperId);
}
