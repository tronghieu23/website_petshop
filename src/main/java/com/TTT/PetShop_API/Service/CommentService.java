package com.TTT.PetShop_API.Service;

import com.TTT.PetShop_API.Model.Comment;
import com.TTT.PetShop_API.Model.Product;
import com.TTT.PetShop_API.Model.Account;
import com.TTT.PetShop_API.Repository.CommentRepository;
import com.TTT.PetShop_API.Repository.ProductRepository;
import com.TTT.PetShop_API.Repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService {

    private final CommentRepository commentRepository;
    private final ProductRepository productRepository;
    private final AccountRepository accountRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${huggingface.api.url}")
    private String huggingFaceApiUrl;

    @Value("${huggingface.api.key}")
    private String huggingFaceApiKey;

    // ✅ Thêm bình luận
    public Comment createComment(Long productId, String accountId, String content) {
        if (isToxicComment(content)) {
            throw new IllegalArgumentException("Bình luận của bạn đã bị chặn vì chứa nội dung toxic!");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại"));

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại"));

        Comment comment = Comment.builder()
                .product(product)
                .account(account)
                .content(content)
                .build();

        return commentRepository.save(comment);
    }

    // ✅ Lấy danh sách bình luận theo productId
    public List<Comment> getCommentsByProduct(Long productId) {
        return commentRepository.findByProductId(productId);
    }

    // ✅ Xóa bình luận (User chủ sở hữu hoặc Admin)
    public boolean deleteComment(Long commentId, String accountId) {
        // Kiểm tra bình luận có tồn tại không
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (commentOptional.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy bình luận");
        }

        Comment comment = commentOptional.get();

        // Kiểm tra tài khoản có tồn tại không
        Optional<Account> accountOptional = accountRepository.findById(accountId);
        if (accountOptional.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }

        Account account = accountOptional.get();

        // Kiểm tra quyền xóa:
        // 1. Người dùng là chủ bình luận
        boolean isOwner = comment.getAccount().getId().equals(accountId);

        // 2. Kiểm tra role của người yêu cầu xóa
        String requesterRole = account.getRole() != null ? account.getRole().getName() : "";
        boolean isAdmin = requesterRole.equals("Quản Trị Viên");
        boolean isManager = requesterRole.equals("Quản Lý");

        // 3. Kiểm tra role của chủ bình luận
        String commentOwnerRole = comment.getAccount().getRole() != null
                ? comment.getAccount().getRole().getName()
                : "";
        boolean commentOwnerIsAdmin = commentOwnerRole.equals("Quản Trị Viên");

        // Logic xóa:
        // - Chủ bình luận luôn được xóa
        // - Quản Trị Viên xóa được tất cả
        // - Quản Lý chỉ xóa được bình luận của Khách Hàng (KHÔNG xóa được của Quản Trị Viên)
        if (isOwner) {
            commentRepository.delete(comment);
            log.info("Comment {} deleted by owner {}", commentId, accountId);
            return true;
        }

        if (isAdmin) {
            commentRepository.delete(comment);
            log.info("Comment {} deleted by Admin {}", commentId, accountId);
            return true;
        }

        if (isManager && !commentOwnerIsAdmin) {
            commentRepository.delete(comment);
            log.info("Comment {} deleted by Manager {}", commentId, accountId);
            return true;
        }

        log.warn("User {} attempted to delete comment {} without permission", accountId, commentId);
        return false;
    }

    // ✅ Kiểm tra bình luận toxic với HuggingFace
    private boolean isToxicComment(String content) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + huggingFaceApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            String body = "{\"inputs\": \"" + content + "\"}";
            HttpEntity<String> request = new HttpEntity<>(body, headers);

            ResponseEntity<List> response = restTemplate.exchange(
                    huggingFaceApiUrl,
                    HttpMethod.POST,
                    request,
                    List.class
            );

            log.info("API Response: {}", response.getBody());

            if (response.getBody() != null && !response.getBody().isEmpty()) {
                // HuggingFace trả về List<List<Map<String, Object>>>
                List<Map<String, Object>> results = (List<Map<String, Object>>) response.getBody().get(0);

                for (Map<String, Object> result : results) {
                    String label = (String) result.get("label");
                    double score = ((Number) result.get("score")).doubleValue();

                    log.info("Label = {}, Score = {}", label, score);

                    // chỉ chặn nếu toxic/insult/obscene/... và score > 0.5
                    if ((label.equalsIgnoreCase("toxic")
                            || label.equalsIgnoreCase("insult")
                            || label.equalsIgnoreCase("obscene")
                            || label.equalsIgnoreCase("severe_toxic"))
                            && score > 0.5) {
                        return true;
                    }
                }
            }

            return false; // không toxic
        } catch (Exception e) {
            log.error("Error checking toxicity: {}", e.getMessage());
            return false; // lỗi API thì cho qua
        }
    }
}