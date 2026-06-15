package com.TTT.PetShop_API.Repository;

import com.TTT.PetShop_API.Model.AccountVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional;

import java.util.List;

@Repository
public interface AccountVoucherRepository extends JpaRepository<AccountVoucher, Long> {

    List<AccountVoucher> findByAccountId(String accountId);

    @Transactional
    @Modifying
    @Query("DELETE FROM AccountVoucher av WHERE av.voucher.id = :voucherId")
    void deleteByVoucherId(@Param("voucherId") Long voucherId);
}
