package com.TTT.PetShop_API.Service;

import com.TTT.PetShop_API.Model.Category;
import com.TTT.PetShop_API.Model.Product;
import com.TTT.PetShop_API.Model.Supplier;
import com.TTT.PetShop_API.Repository.CategoryRepository;
import com.TTT.PetShop_API.Repository.ProductRepository;
import com.TTT.PetShop_API.Repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll().stream()
                .filter(product -> !product.isDeleted() && product.getQuantity() > 0)
                .collect(Collectors.toList());
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id)
                .filter(product -> !product.isDeleted());
    }

    // Lấy tất cả sản phẩm cho admin (bao gồm cả sản phẩm đã xóa mềm)
    public List<Product> getAllProductsForAdmin() {
        return productRepository.findAll();
    }

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    public Product createProduct(com.TTT.PetShop_API.DTO.ProductRequest request) {
        Product product = new Product();

        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setQuantity(request.getQuantity());
        product.setExpirationDate(request.getExpirationDate());
        product.setDiscount(request.getDiscount());
        product.setDiscountExpiration(request.getDiscountExpiration());

        // Gắn category theo ID
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + request.getCategoryId()));
        product.setCategory(category);

        // Gắn supplier theo ID
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found with ID: " + request.getSupplierId()));
        product.setSupplier(supplier);

        // Xử lý ảnh
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            try {
                String imageUrlString = request.getImage();
                File imageFile;

                if (imageUrlString.startsWith("data:")) {
                    String base64Image = extractBase64String(imageUrlString);
                    byte[] imageBytes = Base64.getDecoder().decode(base64Image);
                    imageFile = File.createTempFile("image", ".tmp");
                    try (FileOutputStream fos = new FileOutputStream(imageFile)) {
                        fos.write(imageBytes);
                    }
                } else {
                    URL imageUrl = new URL(imageUrlString);
                    imageFile = File.createTempFile("image", ".tmp");
                    try (InputStream in = imageUrl.openStream()) {
                        Files.copy(in, imageFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
                    }
                }

                String newImageUrl = cloudinaryService.uploadImage(imageFile);
                imageFile.delete();
                product.setImage(newImageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Error uploading image", e);
            }
        }

        return productRepository.save(product);
    }


    private String extractBase64String(String dataUrl) {
        return dataUrl.split(",")[1];
    }

    // Cập nhật sản phẩm (admin)
    // Cập nhật sản phẩm (admin)
    public Optional<Product> updateProduct(Long id, Product proDuct) {
        return productRepository.findById(id).map(product -> {
            product.setName(proDuct.getName());
            product.setPrice(proDuct.getPrice());
            product.setDescription(proDuct.getDescription());
            product.setQuantity(proDuct.getQuantity());

            // Kiểm tra nếu hình ảnh mới khác với hình ảnh hiện tại
            if (proDuct.getImage() != null && !proDuct.getImage().isEmpty() &&
                    !proDuct.getImage().equals(product.getImage())) {
                try {
                    String imageUrlString = proDuct.getImage();
                    File imageFile;

                    if (imageUrlString.startsWith("data:")) {
                        // Xử lý ảnh Base64
                        String base64Image = extractBase64String(imageUrlString);
                        byte[] imageBytes = Base64.getDecoder().decode(base64Image);
                        imageFile = File.createTempFile("image", ".tmp");
                        try (FileOutputStream fos = new FileOutputStream(imageFile)) {
                            fos.write(imageBytes);
                        }
                    } else {
                        // Xử lý ảnh từ URL
                        URL imageUrl = new URL(imageUrlString);
                        imageFile = File.createTempFile("image", ".tmp");
                        try (InputStream in = imageUrl.openStream()) {
                            Files.copy(in, imageFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
                        }
                    }

                    // Upload lên Cloudinary
                    String newImageUrl = cloudinaryService.uploadImage(imageFile);
                    imageFile.delete();
                    product.setImage(newImageUrl);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            // Giữ nguyên dữ liệu khác
            product.setSupplier(product.getSupplier());
            product.setCategory(proDuct.getCategory());
            product.setExpirationDate(proDuct.getExpirationDate());
            product.setDiscount(proDuct.getDiscount());
            product.setDiscountExpiration(proDuct.getDiscountExpiration());
            return productRepository.save(product);
        });
    }

    // Xóa sản phẩm hoàn toàn (admin)
    public void deleteProduct(Long id) {
        if (productRepository.existsById(id)) { // Kiểm tra xem sản phẩm có tồn tại không
            productRepository.deleteById(id); // Xóa sản phẩm khỏi cơ sở dữ liệu
        } else {
            throw new RuntimeException("Product not found with ID: " + id); // Thông báo nếu không tìm thấy sản phẩm
        }
    }

    // Lấy các sản phẩm đang giảm giá và chưa hết hạn sử dụng (cho khách hàng)
    public List<Product> getDiscountedProducts() {
        return productRepository.findByDiscountGreaterThanAndDiscountExpirationAfter(0, LocalDateTime.now()).stream()
                .filter(product -> !product.isDeleted() &&
                        (product.getExpirationDate() == null || product.getExpirationDate().isAfter(LocalDateTime.now())))
                .collect(Collectors.toList());
    }

    // Xóa giảm giá cho sản phẩm nếu hết hạn và xóa mềm sản phẩm nếu hết hạn sử dụng (admin)
    public void removeExpiredDiscounts() {
        List<Product> products = productRepository.findAll();
        for (Product product : products) {
            boolean discountExpired = product.getDiscountExpiration() != null &&
                    product.getDiscountExpiration().isBefore(LocalDateTime.now());
            boolean productExpired = product.getExpirationDate() != null &&
                    product.getExpirationDate().isBefore(LocalDateTime.now());

            if (discountExpired) {
                product.setDiscount(0); // Xóa giảm giá nếu đã hết hạn
                product.setDiscountExpiration(null);
            }

            if (productExpired) {
                product.setDeleted(true); // Đánh dấu sản phẩm là đã hết hạn
            }

            productRepository.save(product); // Lưu sản phẩm

        }

    }
}
