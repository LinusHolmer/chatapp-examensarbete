package se.johan.chatapp.jwt;

import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

public class UserHandshakeHandler extends DefaultHandshakeHandler {
    @Override
    protected Principal determineUser(
            org.springframework.http.server.ServerHttpRequest request,
            org.springframework.web.socket.WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {
        String username = (String) attributes.get("username");
        if (username != null) {
            return () -> username;
        }
        return null;
    }
}
