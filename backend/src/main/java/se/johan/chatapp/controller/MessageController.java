package se.johan.chatapp.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import se.johan.chatapp.dto.DeleteMessageRequest;
import se.johan.chatapp.dto.MessageRequest;
import se.johan.chatapp.dto.MessagesResponse;
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
    public ResponseEntity<?> deleteLatestMessage(Authentication auth, @Valid @RequestBody DeleteMessageRequest request) {
        try {
            Optional<Message> deleted = messageService.deleteMessage(
                    auth.getName(),
                    request.receiver()
            );

            if (deleted.isPresent()) {
                return ResponseEntity.noContent().build(); // 204
            }

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No message found to delete");

        } catch (ResponseStatusException e) {
            // om service kastar en ex 404
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not delete message");
        }
    }


    @GetMapping("/viewMessages")
    public ResponseEntity<?> viewMessages(Authentication auth) {
        List<MessageRequest> messages = messageService.viewMessages(
                auth.getName()
        );
            return ResponseEntity.ok(messages);
    }

    @GetMapping("/testMessages")
    public ResponseEntity<MessagesResponse> testMessages(Authentication auth) {
        List<MessageRequest> messages = messageService.viewMessages(
                auth.getName()
        );
        List<SentMessageDTO> messagesSent = messageService.viewSentMessages(
                auth.getName()
        );

        MessagesResponse response = new MessagesResponse(messages, messagesSent);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/viewSentMessages")
    public ResponseEntity<?> viewSentMessages(Authentication auth) {
        List<SentMessageDTO> messages = messageService.viewSentMessages(
                auth.getName()
        );
            return ResponseEntity.ok(messages);
    }
}

