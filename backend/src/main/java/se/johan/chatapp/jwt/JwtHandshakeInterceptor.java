package se.johan.chatapp.jwt;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import se.johan.chatapp.service.TokenService;

import java.util.Map;

@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {
    private final TokenService tokenService;

    public JwtHandshakeInterceptor(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {
        if(request instanceof ServletServerHttpRequest serverHttpRequest) {
            HttpServletRequest httpServletRequest = serverHttpRequest.getServletRequest();

            if(httpServletRequest.getCookies() != null) {

                for (Cookie cookie : httpServletRequest.getCookies()) {
                    if ("jwt".equals(cookie.getName())) {
                        String token = cookie.getValue();
                        if (tokenService.validateJwtToken(token)) {
                            attributes.put("username",
                                    tokenService.getUsernameFromJwtToken(token));
                            return true;
                        }
                    }
                }
            }
        }
       return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {

    }
}
