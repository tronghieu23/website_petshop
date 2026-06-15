package com.TTT.PetShop_API.Controller;

import com.TTT.PetShop_API.Service.MoMoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class MoMoController {

    @Autowired
    private MoMoService moMoService;

    @GetMapping("/momo")
    public ResponseEntity<?> createMoMoPayment(
            @RequestParam long amount,
            @RequestParam String orderInfo) {
        try {
            String payUrl = moMoService.createPaymentUrl(amount, orderInfo);
            return ResponseEntity.ok(Map.of("payUrl", payUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/momo-return")
    public void momoReturn(@RequestParam Map<String, String> params,
                           HttpServletResponse response) throws Exception {
        String resultCode = params.get("resultCode");
        if ("0".equals(resultCode)) {
            response.sendRedirect("http://localhost:5173/customer/confirm?momoSuccess=true&orderId=" + params.get("orderId"));
        } else {
            response.sendRedirect("http://localhost:5173/customer/checkout?momoFailed=true");
        }
    }

    @PostMapping("/momo-notify")
    public ResponseEntity<?> momoNotify(@RequestBody Map<String, String> ipnParams) {
        System.out.println("MoMo IPN Callback Received: " + ipnParams.toString());
        String resultCode = ipnParams.get("resultCode");
        if ("0".equals(resultCode)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.badRequest().body("Xử lý IPN từ MoMo thất bại");
    }
}