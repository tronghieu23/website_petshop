package com.TTT.PetShop_API.Service;

import com.TTT.PetShop_API.Model.Account;
import com.TTT.PetShop_API.Model.Order;
import com.TTT.PetShop_API.Model.OrderDetail;
import com.TTT.PetShop_API.Repository.AccountRepository;
import com.TTT.PetShop_API.Repository.OrderRepository;
import com.TTT.PetShop_API.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    private Map<String, Order> temporaryOrders = new HashMap<>();

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByAccountId(String accountId) {
        return orderRepository.findByAccountId(accountId);
    }

    public Order createOrder(Order order) {
        Optional<Account> accountOptional = accountRepository.findById(order.getAccount().getId());

        if (accountOptional.isPresent()) {
            Account account = accountOptional.get();
            order.setAccount(account);
            order.setDate(LocalDateTime.now()); // ← đổi sang LocalDateTime

            for (OrderDetail orderDetail : order.getOrderDetails()) {
                productRepository.findById(orderDetail.getProduct().getId())
                        .ifPresentOrElse(product -> {
                            if (product.getQuantity() >= orderDetail.getQuantity()) {
                                product.setQuantity(product.getQuantity() - orderDetail.getQuantity());
                                productRepository.save(product);
                                orderDetail.setOrder(order);
                                orderDetail.setProduct(product);
                            } else {
                                throw new RuntimeException("Không đủ số lượng sản phẩm: " + product.getName());
                            }
                        }, () -> {
                            throw new RuntimeException("Sản phẩm không tồn tại với ID: " + orderDetail.getProduct().getId());
                        });
            }

            return orderRepository.save(order);
        } else {
            throw new RuntimeException("Account not found with id: " + order.getAccount().getId());
        }
    }

    public void saveTemporaryOrder(Order order) {
        temporaryOrders.put(order.getVnpTxnRef(), order);
    }

    public Order getOrderByTxnRef(String vnpTxnRef) {
        return temporaryOrders.get(vnpTxnRef);
    }

    public Order updateOrder(Long id, Order orderDetails) {
        Optional<Order> order = orderRepository.findById(id);
        if (order.isPresent()) {
            Order existingOrder = order.get();
            existingOrder.setCustomerName(orderDetails.getCustomerName());
            existingOrder.setDate(orderDetails.getDate());
            existingOrder.setAddress(orderDetails.getAddress());
            existingOrder.setPhone(orderDetails.getPhone());
            existingOrder.setNote(orderDetails.getNote());
            existingOrder.setTotal(orderDetails.getTotal());
            existingOrder.setPayment(orderDetails.getPayment());
            existingOrder.setPaymentStatus(orderDetails.getPaymentStatus());
            existingOrder.setShippingStatus(orderDetails.getShippingStatus());
            existingOrder.setAccount(orderDetails.getAccount());
            return orderRepository.save(existingOrder);
        }
        return null;
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    public double calculateTotalRevenue() {
        return orderRepository.findAll().stream()
                .filter(order -> "Đã thanh toán".equals(order.getPaymentStatus()) && order.getTotal() != null)
                .mapToDouble(Order::getTotal)
                .sum();
    }

    public long countTotalOrders() {
        return orderRepository.count();
    }
}