package se.johan.chatapp.service;

import com.mongodb.DuplicateKeyException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import se.johan.chatapp.dto.AddFriendRequest;
import se.johan.chatapp.dto.RegisterRequest;
import se.johan.chatapp.model.ChatUser;
import se.johan.chatapp.repository.ChatUserRepository;
import se.johan.chatapp.repository.UsernameOnly;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ChatUserService {
    private final ChatUserRepository chatUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;

    private final static Logger logger = LoggerFactory.getLogger(ChatUserService.class);


    @Autowired
    public ChatUserService(ChatUserRepository chatUserRepository, PasswordEncoder passwordEncoder, TokenService tokenService, AuthenticationManager authenticationManager) {
        this.chatUserRepository = chatUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
    }

    //Kollar först om det finns en användare med samma namn i databasen

    public void registerUser(RegisterRequest registerRequest) {
        if (chatUserRepository.findByUsername(registerRequest.username()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }

        //Skapar ny ChatUser, sätter lösenord och username och hashar lösenord innan det sparas med .encode
        ChatUser chatUser = new ChatUser();
        chatUser.setUsername(registerRequest.username());
        chatUser.setPassword(passwordEncoder.encode(registerRequest.password()));
        chatUser.setRoles(Set.of("ROLE_USER"));

        try {
            //sparar användaren
            logger.info("Successfully registered user {}", registerRequest.username());
            chatUserRepository.save(chatUser);

            //Dubbelkollar att 2 användare inte skrivit in samma namn samtidigt
        } catch (DuplicateKeyException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }
    }

    public void addFriendService(AddFriendRequest addFriendRequest, String username) {

        ChatUser chatUser = chatUserRepository.findByUsername(username);
        ChatUser friend = chatUserRepository.findByUsername(addFriendRequest.friendUsername());

        // skaffa advice klass för alla
        if (chatUser == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        if (friend == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Friend not found");
            }

        if (chatUser.getUsername().equals(friend.getUsername())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot add yourself as a friend");
            }

        if (chatUser.getFriendList().contains(friend.getUsername())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "User is already your friend");
            }
            chatUser.getFriendList().add(friend.getUsername());
            chatUserRepository.save(chatUser);
    }

    public List<String> getFriendsService(String username) {
            ChatUser chatUser = chatUserRepository.findByUsername(username);

            if(chatUser == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
            }
            return chatUser.getFriendList();
        }

        // bytte till chatUsername annars blev discover metoden sur
    public List<String> discoverService(String chatUsername) {
            ChatUser chatUser = chatUserRepository.findByUsername(chatUsername);

            if(chatUser == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
            }

            List<String> userDiscovered = chatUserRepository.findAllBy()
                    .stream()
                    .map(UsernameOnly::getUsername)
                    .filter(username -> username != null)
                    .collect(Collectors.toCollection(ArrayList::new));

            userDiscovered.remove(chatUser.getUsername());
            userDiscovered.removeAll(chatUser.getFriendList());

            Collections.shuffle(userDiscovered);
            int maxSize = 10;
            if (userDiscovered.size() > maxSize) {
                userDiscovered.subList(maxSize, userDiscovered.size()).clear();
            }
            return userDiscovered;
    }

    public ResponseCookie loginUser(RegisterRequest registerRequest) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.username(),
                        registerRequest.password()
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
        logger.info("Successfully logged in user: {}", registerRequest.username());
        return cookie;

    }

    public ResponseCookie logoutUser() {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false) // should be true if using https, but did work?
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();
        //vet inte hur jag ska få in username, Authentication auth blev null
        logger.info("Successfully logged out user");
        return cookie;
    }

    public boolean authCheck(String jwt){

        if(jwt==null || jwt.isEmpty()){
            return false;
        }

        boolean check = tokenService.validateJwtToken(jwt);
        logger.info("Auth Returned: {}", check);
        return check;
    }

}














