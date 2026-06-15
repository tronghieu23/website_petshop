package com.TTT.PetShop_API.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// Response DTO cho comment
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private Long id;
    private String content;
    private LocalDateTime createdAt;

    private ProductInfo product;
    private AccountInfo account;

    // Thông tin sản phẩm cần thiết
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductInfo {
        private Long id;
        private String name;
        private Double price;
        private String image;
    }

    // Thông tin tài khoản an toàn (không trả password)
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AccountInfo {
        private String id;
        private String username;
        private String email;
        private String image;
        private String roleName;
    }
}
