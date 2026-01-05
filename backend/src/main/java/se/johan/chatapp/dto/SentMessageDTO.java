package se.johan.chatapp.dto;

import java.time.LocalDateTime;

public record SentMessageDTO(
        String receiver,
        String body,
        LocalDateTime timestamp
) {
}
