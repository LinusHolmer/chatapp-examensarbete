package se.johan.chatapp.jwt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import se.johan.chatapp.service.TokenService;

import java.util.ArrayList;


@Component
public class JwtWebSocketInterceptor implements ChannelInterceptor {

    private final TokenService tokenService;

    private final static Logger logger = LoggerFactory.getLogger(JwtWebSocketInterceptor.class);

    @Autowired
    public JwtWebSocketInterceptor(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if(StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if(authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new IllegalArgumentException("Missing token");
            }

            String token = authHeader.substring(7);

            if(!tokenService.validateJwtToken(token)){
                throw new IllegalArgumentException("Invalid token");
            }

            String username = tokenService.getUsernameFromJwtToken(token);

            Authentication auth = new UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    new ArrayList<>()
            );

            accessor.setUser(auth);

            logger.info("WebSocket Authenticated user: {}", username);

        }
        return message;
    }
}
