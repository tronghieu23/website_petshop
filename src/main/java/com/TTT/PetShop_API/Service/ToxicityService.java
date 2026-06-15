package com.TTT.PetShop_API.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class ToxicityService {

    @Value("${huggingface.api.url}")
    private String huggingFaceApiUrl;

    @Value("${huggingface.api.key}")
    private String huggingFaceApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Gửi nội dung bình luận lên Hugging Face để kiểm tra toxicity
     */
    private boolean isToxicComment(String content) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + huggingFaceApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            String body = "{\"inputs\": \"" + content.replace("\"", "\\\"") + "\"}";
            HttpEntity<String> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    huggingFaceApiUrl,
                    HttpMethod.POST,
                    request,
                    String.class
            );

            log.info("API Response: {}", response.getBody());

            // Parse JSON kết quả
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode labels = root.get(0);

            for (JsonNode label : labels) {
                if (label.get("label").asText().equalsIgnoreCase("toxic")
                        && label.get("score").asDouble() > 0.7) {
                    return true; // Bình luận độc hại
                }
            }
            return false;
        } catch (Exception e) {
            log.error("Error checking toxicity: {}", e.getMessage());
            return false; // nếu API lỗi thì cho qua, tránh crash
        }
    }
}
