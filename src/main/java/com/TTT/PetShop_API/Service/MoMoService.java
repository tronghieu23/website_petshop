package com.TTT.PetShop_API.Service;

import com.TTT.PetShop_API.Config.MoMoConfig;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
public class MoMoService {

    public String createPaymentUrl(long amount, String orderInfo) throws Exception {
        String orderId    = MoMoConfig.PARTNER_CODE + "_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        String requestId  = UUID.randomUUID().toString();
        String extraData  = "";

        // Tạo rawSignature
        String rawSignature = "accessKey="   + MoMoConfig.ACCESS_KEY
                + "&amount="      + amount
                + "&extraData="   + extraData
                + "&ipnUrl="      + MoMoConfig.NOTIFY_URL
                + "&orderId="     + orderId
                + "&orderInfo="   + orderInfo
                + "&partnerCode=" + MoMoConfig.PARTNER_CODE
                + "&redirectUrl=" + MoMoConfig.RETURN_URL
                + "&requestId="   + requestId
                + "&requestType=" + MoMoConfig.REQUEST_TYPE;

        String signature = hmacSHA256(MoMoConfig.SECRET_KEY, rawSignature);

        // Build JSON body
        JsonObject body = new JsonObject();
        body.addProperty("partnerCode", MoMoConfig.PARTNER_CODE);
        body.addProperty("accessKey",   MoMoConfig.ACCESS_KEY);
        body.addProperty("requestId",   requestId);
        body.addProperty("amount",      amount);
        body.addProperty("orderId",     orderId);
        body.addProperty("orderInfo",   orderInfo);
        body.addProperty("redirectUrl", MoMoConfig.RETURN_URL);
        body.addProperty("ipnUrl",      MoMoConfig.NOTIFY_URL);
        body.addProperty("extraData",   extraData);
        body.addProperty("requestType", MoMoConfig.REQUEST_TYPE);
        body.addProperty("signature",   signature);
        body.addProperty("lang",        "vi");

        // Gọi API MoMo
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost post = new HttpPost(MoMoConfig.ENDPOINT);
            post.setHeader("Content-Type", "application/json");
            post.setEntity(new StringEntity(body.toString(), StandardCharsets.UTF_8));

            try (CloseableHttpResponse response = client.execute(post)) {
                String json = EntityUtils.toString(response.getEntity());
                JsonObject result = JsonParser.parseString(json).getAsJsonObject();

                if (result.has("payUrl")) {
                    return result.get("payUrl").getAsString();
                }
                throw new RuntimeException("MoMo error: " + json);
            }
        }
    }

    private String hmacSHA256(String key, String data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : hash) sb.append(String.format("%02x", b));
        return sb.toString();
    }
}