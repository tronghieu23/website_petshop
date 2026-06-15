package com.TTT.PetShop_API.Controller;

import com.TTT.PetShop_API.Model.Comment;
import com.TTT.PetShop_API.DTO.CommentRequest;
import com.TTT.PetShop_API.Service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Validated
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // ✅ Add comment
    @PostMapping("/comments")
    public ResponseEntity<?> addComment(@Valid @RequestBody CommentRequest request) {
        try {
            Comment comment = commentService.createComment(
                    request.getProductId(),
                    request.getAccountId(),
                    request.getContent()
            );
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Bình luận bị chặn vì chứa nội dung toxic");
        }
    }

    // ✅ Get all comments by product
    @GetMapping("/products/{productId}/comments")
    public ResponseEntity<List<Comment>> getCommentsByProduct(@PathVariable Long productId) {
        List<Comment> comments = commentService.getCommentsByProduct(productId);
        return ResponseEntity.ok(comments);
    }

    // ✅ Delete comment (User hoặc Admin)
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long commentId,
            @RequestBody Map<String, String> requestBody) {

        String accountId = requestBody.get("accountId");
        if (accountId == null || accountId.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "accountId is required"));
        }

        try {
            boolean deleted = commentService.deleteComment(commentId, accountId);
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "Xóa bình luận thành công"));
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Bạn không có quyền xóa bình luận này"));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi xóa bình luận: " + e.getMessage()));
        }
    }
}