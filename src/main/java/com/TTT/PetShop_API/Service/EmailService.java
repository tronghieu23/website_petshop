package com.TTT.PetShop_API.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Random;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Tạo mã xác thực ngẫu nhiên 6 chữ số
     */
    public String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // Tạo số từ 100000 đến 999999
        return String.valueOf(code);
    }

    /**
     * Gửi email chứa mã xác thực 6 số
     */
    public void sendVerificationEmail(String to, String verificationCode) throws MessagingException {
        String subject = "Xác nhận đăng ký tài khoản - HiuLun";
        String content = "<html>"
                + "<body style=\"font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; margin: 0; padding: 0;\">"
                + "<div style=\"max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\">"
                + "<div style=\"padding: 20px; text-align: center; background-color: #FFC1C1;\">"
                + "<img src=\"https://res.cloudinary.com/dvvshh1iv/image/upload/v1743273927/logoweb_tu4udj.png\" alt=\"HiuLun Logo\" style=\"width: 150px; height: auto; margin-bottom: -30px;\">"
                + "<h1 style=\"color: #ffffff; font-size: 24px;\">Xác nhận đăng ký tài khoản</h1>"
                + "</div>"
                + "<div style=\"padding: 20px;\">"
                + "<p style=\"font-size: 16px; color: #333333;\">Cảm ơn bạn đã đăng ký tài khoản tại <b>HiuLun</b>.</p>"
                + "<p style=\"font-size: 16px; color: #333333;\">Mã xác thực của bạn là:</p>"
                + "<div style=\"text-align: center; margin: 30px 0;\">"
                + "<div style=\"display: inline-block; padding: 20px 40px; font-size: 32px; font-weight: bold; color: #333333; background-color: #f0f0f0; border: 2px dashed #FFC1C1; border-radius: 8px; letter-spacing: 8px;\">"
                + verificationCode
                + "</div>"
                + "</div>"
                + "<p style=\"font-size: 14px; color: #666666;\">Mã xác thực có hiệu lực trong <b>10 phút</b>.</p>"
                + "<p style=\"font-size: 14px; color: #666666;\">Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>"
                + "</div>"
                + "<div style=\"padding: 10px; text-align: center; background-color: #f1f1f1; font-size: 12px; color: #999999;\">"
                + "<p>HiuLun © 2024. Tất cả các quyền được bảo lưu.</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        sendEmail(to, subject, content);
    }

    /**
     * Gửi email thông báo kích hoạt tài khoản thành công
     */
    public void sendVerificationSuccessEmail(String to) throws MessagingException {
        String subject = "Kích hoạt tài khoản thành công - HiuLun";
        String content = "<html>"
                + "<body style=\"font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; margin: 0; padding: 0;\">"
                + "<div style=\"max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\">"
                + "<div style=\"padding: 20px; text-align: center; background-color: #FFC1C1;\">"
                + "<img src=\"https://res.cloudinary.com/dvvshh1iv/image/upload/v1743273927/logoweb_tu4udj.png\" alt=\"HiuLun Logo\" style=\"width: 150px; height: auto; margin-bottom: -30px;\">"
                + "<h1 style=\"color: #ffffff; font-size: 24px;\">Kích hoạt tài khoản thành công</h1>"
                + "</div>"
                + "<div style=\"padding: 20px;\">"
                + "<p style=\"font-size: 16px; color: #333333;\">Chúc mừng! Tài khoản của bạn đã được kích hoạt thành công tại <b>HiuLun</b>.</p>"
                + "<p style=\"font-size: 16px; color: #333333;\">Bây giờ bạn có thể đăng nhập và trải nghiệm các dịch vụ của chúng tôi.</p>"
                + "<div style=\"text-align: center; margin: 20px 0;\">"
                + "<a href=\"http://localhost:3000/account/Login\" style=\"display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #FFC1C1; text-decoration: none; border-radius: 5px;\">Đăng nhập ngay</a>"
                + "</div>"
                + "</div>"
                + "<div style=\"padding: 10px; text-align: center; background-color: #f1f1f1; font-size: 12px; color: #999999;\">"
                + "<p>HiuLun © 2024. Tất cả các quyền được bảo lưu.</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        sendEmail(to, subject, content);
    }

    /**
     * Phương thức private để gửi email
     */
    private void sendEmail(String to, String subject, String content) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(content, true);
        mailSender.send(message);
    }
}