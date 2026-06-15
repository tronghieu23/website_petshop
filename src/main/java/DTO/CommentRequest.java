package com.TTT.PetShop_API.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequest {
    private Long productId;   // Product.id = Long
    private String accountId; // Account.id = String
    private String content;
}
