package se.johan.chatapp.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SendMessageRequest(
        @Size(max = 500, message = "Maximum characters is 500")@NotBlank(message = "Message can not be Blank")
        String body,
        @Size(max = 50, message = "Maximum characters is 50")@NotBlank(message = "Receiver can not be Blank")
    String receiver
    )

    {}