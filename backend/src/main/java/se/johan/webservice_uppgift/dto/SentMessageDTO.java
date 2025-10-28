package se.johan.webservice_uppgift.dto;

import java.time.LocalDateTime;

public record SentMessageDTO(
        String receiver,
        String body,
        LocalDateTime timestamp
) {
}
