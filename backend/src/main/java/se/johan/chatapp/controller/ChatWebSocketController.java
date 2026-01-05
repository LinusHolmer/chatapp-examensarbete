package se.johan.chatapp.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;
import se.johan.chatapp.dto.SendMessageRequest;
import se.johan.chatapp.model.Message;
import se.johan.chatapp.service.MessageService;

import java.security.Principal;

@Controller
public class ChatWebSocketController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(MessageService messageService, SimpMessagingTemplate messagingTemplate) {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(SendMessageRequest sendMessageRequest, Principal principal) {

        Message saved = messageService.newSendMessage(
                principal.getName(),
                sendMessageRequest.body(),
                sendMessageRequest.receiver()
        );

        messagingTemplate.convertAndSendToUser(
                sendMessageRequest.receiver(),
                "/queue/messages",
                saved
        );
    }

}
