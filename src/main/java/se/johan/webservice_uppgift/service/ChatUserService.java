package se.johan.webservice_uppgift.service;


import com.mongodb.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import se.johan.webservice_uppgift.dto.AddFriendRequest;
import se.johan.webservice_uppgift.dto.RegisterRequest;
import se.johan.webservice_uppgift.model.ChatUser;
import se.johan.webservice_uppgift.repository.ChatUserRepository;
import se.johan.webservice_uppgift.repository.UsernameOnly;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatUserService {
    private final ChatUserRepository chatUserRepository;
    private final PasswordEncoder passwordEncoder;


    public ChatUserService(ChatUserRepository chatUserRepository, PasswordEncoder passwordEncoder) {
        this.chatUserRepository = chatUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private ChatUser authenticateUser(String username, String password) {
        ChatUser chatUser = chatUserRepository.findByUsername(username);

        if (chatUser == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        if (!passwordEncoder.matches(password, chatUser.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong password");
        }

        return chatUser;
    }


    //Kollar först om det finns en användare med samma namn i databasen

    public ChatUser registerUser(RegisterRequest registerRequest) {
        if (chatUserRepository.findByUsername(registerRequest.username()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }

        //Skapar ny ChatUser, sätter lösenord och username och hashar lösenord innan det sparas med .encode

        ChatUser chatUser = new ChatUser();
        chatUser.setUsername(registerRequest.username());
        chatUser.setPassword(passwordEncoder.encode(registerRequest.password()));

        try {
            //sparar användaren
            return chatUserRepository.save(chatUser);

            //Dubbelkollar att 2 användare inte skrivit in samma namn samtidigt
        } catch (DuplicateKeyException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }
    }

    public ChatUser addFriendService(AddFriendRequest addFriendRequest) {
        ChatUser chatUser = authenticateUser(addFriendRequest.username(), addFriendRequest.password());

        ChatUser friend = chatUserRepository.findByUsername(addFriendRequest.friendUsername());
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
        return chatUserRepository.save(chatUser);
    }


    public List<String> getFriendsService(RegisterRequest registerRequest) {
        ChatUser chatUser = authenticateUser(registerRequest.username(), registerRequest.password());
        return chatUser.getFriendList();
    }


    public List<String> discoverService(RegisterRequest registerRequest) {
        ChatUser chatUser = authenticateUser(registerRequest.username(), registerRequest.password());

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



}











