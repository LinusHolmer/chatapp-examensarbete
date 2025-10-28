package se.johan.webservice_uppgift.controller;


import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.johan.webservice_uppgift.dto.AddFriendRequest;
import se.johan.webservice_uppgift.dto.RegisterRequest;
import se.johan.webservice_uppgift.model.ChatUser;
import se.johan.webservice_uppgift.repository.ChatUserRepository;
import se.johan.webservice_uppgift.service.ChatUserService;


import java.util.List;

@RestController
@RequestMapping("/chatUser")
public class ChatUserController {
    private final ChatUserService service;
    private final ChatUserRepository chatUserRepository;

    public ChatUserController(ChatUserService service, ChatUserRepository chatUserRepository) {
        this.service = service;
        this.chatUserRepository = chatUserRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<ChatUser> register(@Valid @RequestBody RegisterRequest registerRequest) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.registerUser(registerRequest));
    }

    @PutMapping("/addFriend")
    public ResponseEntity<ChatUser> addFriend(@Valid @RequestBody AddFriendRequest addFriendRequest) {
        ChatUser updatedUser = service.addFriendService(addFriendRequest);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/getFriends")
    public ResponseEntity<List<String>> getFriends(@Valid @RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(service.getFriendsService(registerRequest));
    }

    @GetMapping("/discover")
    public ResponseEntity<List<String>> discoverUsers(@Valid @RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(service.discoverService(registerRequest));
    }

}
