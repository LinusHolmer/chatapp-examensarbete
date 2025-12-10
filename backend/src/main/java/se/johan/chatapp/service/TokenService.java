package se.johan.chatapp.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import org.slf4j.Logger ;
import org.slf4j.LoggerFactory ;
import se.johan.chatapp.model.ChatUser;
import se.johan.chatapp.repository.ChatUserRepository;

import java.security.KeyPair;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

@Service
public class TokenService {

    private final JwtEncoder jwtEncoder;

    private static final Logger logger = LoggerFactory.getLogger(TokenService.class);
    private final ChatUserRepository chatUserRepository;
    private final KeyPair keyPair;

    @Autowired
    public TokenService(JwtEncoder jwtEncoder, ChatUserRepository chatUserRepository, KeyPair keyPair) {
        this.jwtEncoder = jwtEncoder;
        this.chatUserRepository = chatUserRepository;
        this.keyPair = keyPair;
    }

    public String generateToken(Authentication authentication) {
        Instant now = Instant.now();

        String scope = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));

        ChatUser chatUser = chatUserRepository.findByUsername(authentication.getName());
        Instant lastPasswordChange = chatUser.getLastPasswordChange();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(1, ChronoUnit.HOURS))
                .subject(authentication.getName())
                .claim("scope", scope)
                .claim("lastPasswordChange", lastPasswordChange.toString())
                .build();

        logger.info("JWT generated successfully for user: {}", authentication.getName());
        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public String getUsernameFromJwtToken (String token){
        try{
            Claims claims = Jwts.parser()
                    .verifyWith(keyPair.getPublic())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String username = claims.getSubject();
            logger.debug("Extracted username '{}' from JWT token", username);
            return username;
        } catch (Exception e) {
            return null;
        }
    }

    public boolean validateJwtToken (String authToken){
        try{
            Jwts.parser()
                    .verifyWith(keyPair.getPublic())
                    .build()
                    .parseSignedClaims(authToken);

            logger.debug("JWT validation succeeded");
            return true;
        } catch (Exception e) {
            logger.error("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }

    public Instant getLastPasswordChangeFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(keyPair.getPublic())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String lastChange = claims.get("lastPasswordChange", String.class);
            if (lastChange == null) {
                return null;
            }

            return Instant.parse(lastChange);

        } catch (Exception e) {
            logger.warn("getLastPasswordChangeFromToken failed!");
            return null;
        }
    }




}
