package com.TTT.PetShop_API.Service;

import com.TTT.PetShop_API.Model.Suggest;
import com.TTT.PetShop_API.Repository.SuggestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SuggestService {

    @Autowired
    private SuggestRepository suggestRepository;

    // Gợi ý tìm kiếm không phân biệt chữ hoa/chữ thường, từ khóa xuất hiện ở bất kỳ vị trí nào
    public List<String> getSuggestions(String query) {
        // Nếu query rỗng hoặc null, trả về danh sách trống
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }

        List<Suggest> results = suggestRepository.findTop10ByNameContainingIgnoreCase(query.trim());

        // Map kết quả thành danh sách tên sản phẩm
        return results.stream()
                .map(Suggest::getName)
                .collect(Collectors.toList());
    }
}
