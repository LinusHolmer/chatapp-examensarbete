package se.johan.chatapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import se.johan.chatapp.model.ChatUser;
import se.johan.chatapp.repository.ChatUserRepository;

import java.util.List;

@Service
public class MyUserDetailsService implements UserDetailsService {

    private final ChatUserRepository chatUserRepository;

    @Autowired
    public MyUserDetailsService(ChatUserRepository chatUserRepository) {
        this.chatUserRepository = chatUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        ChatUser chatUser = chatUserRepository.findByUsername(username);

        if(chatUser == null) {
            throw new UsernameNotFoundException(username);
        }
        return new org.springframework.security.core.userdetails.User(
                chatUser.getUsername(),
                chatUser.getPassword(),
                true,
                true,
                true,
                true,
                List.of(new SimpleGrantedAuthority("ROLE_" + chatUser.getRoles()))
        );
    }
}
