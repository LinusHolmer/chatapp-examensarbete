package se.johan.webservice_uppgift.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record MessageRequest(
       @Size(max = 50, message = "Maximum characters is 50")@NotBlank(message = "Sender can not be Blank") String sender,
       @Size(max = 500, message = "Maximum characters is 500")@NotBlank(message = "Body can not be Blank") String body,
        LocalDateTime timestamp
) {}
