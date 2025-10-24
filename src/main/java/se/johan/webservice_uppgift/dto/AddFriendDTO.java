package se.johan.webservice_uppgift.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddFriendDTO(
        @Size(max = 50, message = "Maximum characters is 50")@NotBlank(message = "Username can not be BLANK")
        String username,
        @Size(max = 50, message = "Maximum characters is 50")@NotBlank(message = "Password can not be BLANK")
        String password,
        @Size(max = 50, message = "Maximum characters is 50")@NotBlank(message = "FriendUsername can not be BLANK")
        String friendUsername
) {}