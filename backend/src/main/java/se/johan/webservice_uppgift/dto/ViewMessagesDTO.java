package se.johan.webservice_uppgift.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ViewMessagesDTO(
        String username,
        String password
)
{}


