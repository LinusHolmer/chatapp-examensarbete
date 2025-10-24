package se.johan.webservice_uppgift.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SendMessageRequest(

        @Size(max = 50, message = "Maximum characters is 50")@NotBlank(message = "Name can not be Blank")
    String username,
        @Size(max = 50, message = "Maximum characters is 50")@NotBlank(message = "Password can not be Blank")
    String password,
        @Size(max = 500, message = "Maximum characters is 500")@NotBlank(message = "Message can not be Blank") String body,
        @Size(max = 50, message = "Maximum characters is 50")@NotBlank(message = "Receiver can not be Blank")
    String receiver
    )

    {}