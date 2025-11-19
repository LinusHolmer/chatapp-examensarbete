package se.johan.chatapp.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import se.johan.chatapp.dto.RegisterDTO;
import se.johan.chatapp.dto.RegisterRequest;
import se.johan.chatapp.model.ChatUser;
import se.johan.chatapp.service.ChatUserService;
import se.johan.chatapp.service.TokenService;

import java.security.KeyPair;
import java.security.interfaces.RSAPublicKey;
import java.util.Base64;

@RestController
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final ChatUserService service;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, TokenService tokenService, ChatUserService service) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.service = service;
    }

    @Autowired
    private KeyPair keyPair;


    @GetMapping("/public-key")
    public String getPublicKey(){
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
        return Base64.getEncoder().encodeToString(publicKey.getEncoded());
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest registerRequest) {
        service.registerUser(registerRequest);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }


    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody RegisterDTO registerDTO) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerDTO.username(),
                        registerDTO.password()
                )
        );

        String token = tokenService.generateToken(auth);

        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false) // should be true if using https
                .path("/")
                .maxAge(60 * 60)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();

    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.noContent().build();
    }

}
