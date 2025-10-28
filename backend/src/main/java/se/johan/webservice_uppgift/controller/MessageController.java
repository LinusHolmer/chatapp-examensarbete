package se.johan.webservice_uppgift.controller;


import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.johan.webservice_uppgift.dto.MessageRequest;
import se.johan.webservice_uppgift.dto.SendMessageRequest;
import se.johan.webservice_uppgift.dto.SentMessageDTO;
import se.johan.webservice_uppgift.dto.ViewMessagesDTO;
import se.johan.webservice_uppgift.model.Message;
import se.johan.webservice_uppgift.repository.MessageRepository;
import se.johan.webservice_uppgift.service.MessageService;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/messages")
public class MessageController {

    private final MessageService messageService;
    private final MessageRepository messageRepository;

    public MessageController(MessageService messageService, MessageRepository messageRepository) {
        this.messageService = messageService;
        this.messageRepository = messageRepository;
    }

    @PostMapping("/sendNew")
    public ResponseEntity<?> sendNewMessage(@Valid @RequestBody SendMessageRequest request) {
        try {
            messageService.sendMessage(
                    request.username(),
                    request.password(),
                    request.body(),
                    request.receiver()
            );

            return ResponseEntity.status(HttpStatus.CREATED).build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Fel användarnamn eller lösenord");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Mottagaren finns inte");
        }
    }





    @DeleteMapping("/deleteLatest")
    public ResponseEntity<Void> deleteLatestMessage(@RequestBody SendMessageRequest request) {
        Optional<Message> deleted = messageService.deleteMessage(
                request.username(),
                request.password(),
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
    public ResponseEntity<?> viewMessages(@RequestBody ViewMessagesDTO request) {
        List<MessageRequest> messages = messageService.viewMessages(
                request.username(),
                request.password()
        );

        if (messages == null) {
            return ResponseEntity.status(401).body("Fel användarnamn eller lösenord");
        } else if (messages.isEmpty()) {
            return ResponseEntity.ok("Inga meddelanden att visa");
        } else {
            return ResponseEntity.ok(messages);
        }
    }

    @GetMapping("/viewSentMessages")
    public ResponseEntity<?> viewSentMessages(@RequestBody ViewMessagesDTO request) {
        List<SentMessageDTO> messages = messageService.viewSentMessages(
                request.username(),
                request.password()
        );

        if (messages == null) {
            return ResponseEntity.status(401).body("Fel användarnamn eller lösenord");
        } else if (messages.isEmpty()) {
            return ResponseEntity.ok("Inga meddelanden att visa");
        } else {
            return ResponseEntity.ok(messages);
        }
    }
}

