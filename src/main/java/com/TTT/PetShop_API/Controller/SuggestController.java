package com.TTT.PetShop_API.Controller;

import com.TTT.PetShop_API.Service.SuggestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SuggestController {

    @Autowired
    private SuggestService suggestService;

    @GetMapping("/suggestions")
    public List<String> getSuggestions(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new IllegalArgumentException("Query cannot be null or empty");
        }
        return suggestService.getSuggestions(query);
    }
}
