package se.johan.chatapp.controller;

import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.johan.chatapp.dto.AddFriendRequest;
import se.johan.chatapp.model.ChatUser;
import se.johan.chatapp.service.ChatUserService;


import java.util.List;

@RestController
@RequestMapping("/chatUser")
public class ChatUserController {
    private final ChatUserService service;

    @Autowired
    public ChatUserController(ChatUserService service) {
        this.service = service;
    }

    @PutMapping("/addFriend")
    public ResponseEntity<ChatUser> addFriend(Authentication auth, @Valid @RequestBody AddFriendRequest addFriendRequest) {
        service.addFriendService(addFriendRequest, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getFriends")
    public ResponseEntity<List<String>> getFriends(Authentication auth) {
        return ResponseEntity.ok(service.getFriendsService(auth.getName()));
    }

    @GetMapping("/discover")
    public ResponseEntity<List<String>> discoverUsers(Authentication auth) {
        return ResponseEntity.ok(service.discoverService(auth.getName()));
    }

}
