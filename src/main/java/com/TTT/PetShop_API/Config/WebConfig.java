package com.TTT.PetShop_API.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import com.TTT.PetShop_API.Service.CloudinaryService;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${cloudinary.cloud_name}")
    private String cloudName;

    @Value("${cloudinary.api_key}")
    private String apiKey;

    @Value("${cloudinary.api_secret}")
    private String apiSecret;

    @Bean
    public CloudinaryService cloudinaryService() {
        return new CloudinaryService(cloudName, apiKey, apiSecret);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Cấu hình cho các API chính của bạn
        registry.addMapping("/api/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);

        // 🔥 Thêm cấu hình này để nếu backend có lỗi, trình duyệt vẫn đọc được lỗi chứ không báo CORS
        registry.addMapping("/error")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
