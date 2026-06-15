package com.TTT.PetShop_API.Controller;

import com.TTT.PetShop_API.Model.Account;
import com.TTT.PetShop_API.Service.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    // Đăng ký
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Account account) {
        try {
            accountService.signup(account);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.");
            response.put("email", account.getEmail());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "Đăng ký thất bại: " + ex.getMessage()));
        }
    }

    // Xác thực mã 6 số
    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, Object>> verifyCode(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");

            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Collections.singletonMap("message", "Email không được để trống"));
            }

            if (code == null || code.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Collections.singletonMap("message", "Mã xác thực không được để trống"));
            }

            boolean isVerified = accountService.verifyAccountByTokenAndEmail(code, email);

            if (isVerified) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Xác thực tài khoản thành công");
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("message", "Mã xác thực không đúng hoặc đã hết hạn"));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "Lỗi server: " + e.getMessage()));
        }
    }

    // Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Account account) {
        try {
            Account authenticatedAccount = accountService.login(account);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đăng nhập thành công");
            response.put("id", authenticatedAccount.getId());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Đăng nhập thất bại. Vui lòng thử lại."));
        }
    }

    // Cập nhật tài khoản
    @PutMapping("/{id}")
    public ResponseEntity<Account> updateAccount(@PathVariable String id, @RequestBody Account account) {
        return accountService.updateAccountById(id, account)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/internal/{id}")
    public ResponseEntity<Map<String, Object>> updateAccountInternal(
            @PathVariable String id,
            @RequestBody Account account,
            @RequestHeader("requester-id") String requesterId) {

        Account requester = new Account();
        requester.setId(requesterId);

        try {
            Optional<Account> updatedAccount = accountService.updateAccountById(id, account, requester);
            if (updatedAccount.isPresent()) {
                return ResponseEntity.ok(Collections.singletonMap("message", "Cập nhật tài khoản thành công"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", ex.getMessage()));
        }
    }

    // Xóa tài khoản
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteAccount(
            @PathVariable String id,
            @RequestHeader("requester-id") String requesterId) {

        Account requester = new Account();
        requester.setId(requesterId);

        try {
            accountService.deleteAccountById(id, requester);
            return ResponseEntity.ok(Collections.singletonMap("message", "Xóa tài khoản thành công"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", ex.getMessage()));
        }
    }

    // Tạo tài khoản
    @PostMapping
    public ResponseEntity<Map<String, Object>> createAccount(
            @RequestBody Account account,
            @RequestHeader("requester-id") String requesterId) {

        Account requester = new Account();
        requester.setId(requesterId);

        try {
            accountService.createAccount(account, requester);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Collections.singletonMap("message", "Tạo tài khoản thành công"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", ex.getMessage()));
        }
    }

    // Lấy tất cả tài khoản
    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    // Lấy tài khoản theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccountById(@PathVariable String id) {
        List<Account> accounts = accountService.getAccountsByIds(Collections.singletonList(id));
        if (!accounts.isEmpty()) {
            return ResponseEntity.ok(accounts.get(0));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Lấy danh sách khách hàng
    @GetMapping("/customers")
    public ResponseEntity<List<Account>> getCustomers() {
        return ResponseEntity.ok(accountService.getCustomers());
    }

    // Lấy danh sách nội bộ
    @GetMapping("/internal")
    public ResponseEntity<List<Account>> getInternalUsers() {
        return ResponseEntity.ok(accountService.getInternalUsers());
    }

    // Đếm số lượng khách hàng
    @GetMapping("/count/customers")
    public long countTotalCustomers() {
        return accountService.countTotalCustomers();
    }
}