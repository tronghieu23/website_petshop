package com.TTT.PetShop_API.Repository;

import com.TTT.PetShop_API.Model.Suggest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuggestRepository extends JpaRepository<Suggest, Long> {

    // Tìm kiếm sản phẩm chứa từ khóa ở bất kỳ vị trí nào (ưu tiên sử dụng)
    List<Suggest> findTop10ByNameContainingIgnoreCase(String query);

    // Tìm kiếm các sản phẩm có tên bắt đầu với từ khóa (nếu cần)
    List<Suggest> findTop10ByNameStartingWithIgnoreCase(String query);
}
