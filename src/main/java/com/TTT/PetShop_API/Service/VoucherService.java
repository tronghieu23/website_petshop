package com.TTT.PetShop_API.Service;

import com.TTT.PetShop_API.Model.Account;
import com.TTT.PetShop_API.Model.AccountVoucher;
import com.TTT.PetShop_API.Model.Voucher;
import com.TTT.PetShop_API.Model.VoucherDTO;
import com.TTT.PetShop_API.Repository.AccountRepository;
import com.TTT.PetShop_API.Repository.AccountVoucherRepository;
import com.TTT.PetShop_API.Repository.VoucherRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private AccountVoucherRepository accountVoucherRepository;

    @Autowired
    private AccountRepository accountRepository;

    // Lấy tất cả voucher
    public List<Voucher> getAllVouchers() {
        List<Voucher> vouchers = voucherRepository.findAll();
        vouchers.forEach(Voucher::updateStatus);
        voucherRepository.saveAll(vouchers);
        return vouchers;
    }

    // Lấy voucher theo mã code
    public Optional<Voucher> getVoucherByCode(String code) {
        Optional<Voucher> voucherOpt = voucherRepository.findByCode(code);
        voucherOpt.ifPresent(Voucher::updateStatus);
        return voucherOpt;
    }

    // Tạo voucher mới
    public Voucher createVoucher(Voucher voucher) {
        voucher.updateStatus();
        return voucherRepository.save(voucher);
    }

    // Xóa voucher theo ID
    @Transactional
    public void deleteVoucher(Long id) {
        Optional<Voucher> voucherOpt = voucherRepository.findById(id);
        if (voucherOpt.isEmpty()) {
            throw new RuntimeException("Voucher không tồn tại!");
        }

        try {
            accountVoucherRepository.deleteByVoucherId(id);
            voucherRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Không thể xóa voucher vì có dữ liệu liên quan!");
        } catch (Exception e) {
            throw new RuntimeException("Lỗi không xác định khi xóa voucher!");
        }
    }

    public String applyVoucherToAccount(String accountId, String voucherCode) {
        Optional<Voucher> voucherOpt = voucherRepository.findByCode(voucherCode);
        if (voucherOpt.isEmpty()) {
            return "Mã voucher không tồn tại!";
        }

        Optional<Account> accountOpt = accountRepository.findById(accountId);
        if (accountOpt.isEmpty()) {
            return "Tài khoản không hợp lệ!";
        }

        Voucher voucher = voucherOpt.get();
        Account account = accountOpt.get();

        Optional<AccountVoucher> existingAccountVoucherOpt = account.getAccountVouchers().stream()
                .filter(av -> av.getVoucher().getCode().equals(voucherCode))
                .findFirst();

        if (existingAccountVoucherOpt.isPresent()) {
            AccountVoucher existingAccountVoucher = existingAccountVoucherOpt.get();
            if (existingAccountVoucher.isApplied()) {
                return "Mã voucher đã được áp dụng trước đó!";
            }
            existingAccountVoucher.setApplied(false);
            accountVoucherRepository.save(existingAccountVoucher);
            return "Voucher đã được lưu và áp dụng thành công!";
        }

        AccountVoucher accountVoucher = new AccountVoucher();
        accountVoucher.setAccount(account);
        accountVoucher.setVoucher(voucher);
        accountVoucher.setApplied(false);
        accountVoucher.setSaved(true);
        accountVoucherRepository.save(accountVoucher);

        return "Voucher đã được lưu thành công!";
    }

    // Cập nhật voucher
    @Transactional
    public Optional<Voucher> updateVoucher(Long id, Voucher updatedVoucher) {
        Optional<Voucher> voucherOpt = voucherRepository.findById(id);

        if (voucherOpt.isPresent()) {
            Voucher existingVoucher = voucherOpt.get();
            existingVoucher.setCode(updatedVoucher.getCode());
            existingVoucher.setDiscount(updatedVoucher.getDiscount());
            existingVoucher.setExpirationDate(updatedVoucher.getExpirationDate());
            existingVoucher.setDescription(updatedVoucher.getDescription());
            existingVoucher.setActive(updatedVoucher.isActive());
            existingVoucher.updateStatus();
            voucherRepository.save(existingVoucher);
            return Optional.of(existingVoucher);
        }

        return Optional.empty();
    }

    public boolean checkVoucherSaved(String accountId, String voucherCode) {
        Optional<AccountVoucher> accountVoucherOpt = accountVoucherRepository.findByAccountId(accountId).stream()
                .filter(av -> av.getVoucher().getCode().equals(voucherCode))
                .findFirst();

        return accountVoucherOpt.map(AccountVoucher::isSaved).orElse(false);
    }

    public List<VoucherDTO> getAccountVouchers(String accountId) {
        List<AccountVoucher> accountVouchers = accountVoucherRepository.findByAccountId(accountId);
        return accountVouchers.stream()
                .map(accountVoucher -> new VoucherDTO(
                        accountVoucher.getVoucher().getId(),
                        accountVoucher.getVoucher().getCode(),
                        accountVoucher.getVoucher().getDiscount()))
                .collect(Collectors.toList());
    }
}