package se.johan.chatapp.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import se.johan.chatapp.dto.MessageRequest;
import se.johan.chatapp.dto.SendMessageRequest;
import se.johan.chatapp.dto.SentMessageDTO;
import se.johan.chatapp.model.Message;
import se.johan.chatapp.service.MessageService;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/messages")
public class MessageController {

    private final MessageService messageService;
    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/sendNew")
    public ResponseEntity<?> sendNewMessage(Authentication auth, @Valid @RequestBody SendMessageRequest request) {
            messageService.sendMessage(
                    auth.getName(),
                    request.body(),
                    request.receiver()
            );
            return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/deleteLatest")
    public ResponseEntity<Void> deleteLatestMessage(Authentication auth, @Valid @RequestBody SendMessageRequest request) {
        Optional<Message> deleted = messageService.deleteMessage(
                auth.getName(),
                request.receiver()
        );

        if (deleted.isPresent()) {
            // 204 No Content, ingen body
            return ResponseEntity.noContent().build();
        } else {
            // 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/viewMessages")
    public ResponseEntity<?> viewMessages(Authentication auth) {
        List<MessageRequest> messages = messageService.viewMessages(
                auth.getName()
        );
            return ResponseEntity.ok(messages);
    }

    @GetMapping("/viewSentMessages")
    public ResponseEntity<?> viewSentMessages(Authentication auth) {
        List<SentMessageDTO> messages = messageService.viewSentMessages(
                auth.getName()
        );
            return ResponseEntity.ok(messages);
    }
}

