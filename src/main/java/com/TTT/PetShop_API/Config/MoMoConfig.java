package com.TTT.PetShop_API.Config;

public class MoMoConfig {
    public static final String PARTNER_CODE = "MOMO";
    public static final String ACCESS_KEY   = "F8BBA842ECF85";
    public static final String SECRET_KEY   = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    public static final String RETURN_URL   = "http://localhost:8080/api/payment/momo-return";
    public static final String NOTIFY_URL   = "http://localhost:8080/api/payment/momo-notify";
    public static final String ENDPOINT     = "https://test-payment.momo.vn/v2/gateway/api/create";
    public static final String REQUEST_TYPE = "payWithMethod";
}