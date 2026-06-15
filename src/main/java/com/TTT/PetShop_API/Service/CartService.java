package com.TTT.PetShop_API.Service;

import com.TTT.PetShop_API.Model.Account;
import com.TTT.PetShop_API.Model.CartItem;
import com.TTT.PetShop_API.Model.Product;
import com.TTT.PetShop_API.Repository.AccountRepository;
import com.TTT.PetShop_API.Repository.CartItemRepository;
import com.TTT.PetShop_API.Repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private static final Logger log = LoggerFactory.getLogger(CartService.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private AccountRepository accountRepository;

    public CartItem addItemToCart(Long productId, int quantity, String accountId) {
        if (accountId == null || accountId.trim().isEmpty()) {
            throw new IllegalArgumentException("Account ID cannot be null or empty");
        }

        Optional<Product> productOpt = productRepository.findById(productId);
        Optional<Account> accountOpt = accountRepository.findById(accountId);

        if (productOpt.isPresent() && accountOpt.isPresent()) {
            Product product = productOpt.get();
            Account account = accountOpt.get();
            Optional<CartItem> existingCartItemOpt = cartItemRepository.findByProductAndAccount(product, account);

            if (existingCartItemOpt.isPresent()) {
                CartItem existingCartItem = existingCartItemOpt.get();
                existingCartItem.setQuantity(existingCartItem.getQuantity() + quantity);
                log.info("Updated quantity for product {} in account {}'s cart", productId, accountId);
                return cartItemRepository.save(existingCartItem);
            } else {
                CartItem cartItem = new CartItem(product, account, quantity);
                log.info("Added new product {} to account {}'s cart", productId, accountId);
                return cartItemRepository.save(cartItem);
            }
        } else {
            throw new RuntimeException("Product or Account not found.");
        }
    }

    public List<CartItem> listCartItems(String accountId) {
        log.debug("Received accountId: {}", accountId); // Thêm để debug
        if (accountId == null || accountId.trim().isEmpty()) {
            log.warn("Account ID is null or empty, returning empty cart");
            return Collections.emptyList(); // Trả về danh sách rỗng thay vì ném lỗi
        }

        log.info("Fetching cart items for account ID: {}", accountId);

        Optional<Account> accountOpt = accountRepository.findById(accountId);
        if (accountOpt.isPresent()) {
            Account account = accountOpt.get();
            return cartItemRepository.findByAccount(account);
        } else {
            throw new RuntimeException("Account not found with id: " + accountId);
        }
    }

    public CartItem updateCartItem(Long cartItemId, int quantity) {
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(cartItemId);
        if (cartItemOpt.isPresent()) {
            CartItem cartItem = cartItemOpt.get();
            cartItem.setQuantity(quantity);
            log.info("Updated quantity for cart item ID: {}", cartItemId);
            return cartItemRepository.save(cartItem);
        } else {
            throw new RuntimeException("Cart item not found with id: " + cartItemId);
        }
    }

    public void removeCartItem(Long cartItemId) {
        log.info("Removing cart item ID: {}", cartItemId);
        cartItemRepository.deleteById(cartItemId);
    }
}