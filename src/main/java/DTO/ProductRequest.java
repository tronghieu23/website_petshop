package com.TTT.PetShop_API.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ProductRequest {
    private String name;
    private double price;
    private String description;
    private String image;
    private int quantity;
    private LocalDateTime expirationDate;
    private int discount;
    private LocalDateTime discountExpiration;
    private Long categoryId;
    private Long supplierId;
}
