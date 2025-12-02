package se.johan.chatapp.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddFriendRequest(
        @Size(max = 50, message = "Maximum characters is 50")@NotBlank(message = "FriendUsername can not be BLANK")
        String friendUsername
) {}