package se.johan.chatapp.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import se.johan.chatapp.model.ChatUser;

import java.util.List;

@Repository
public interface ChatUserRepository extends MongoRepository<ChatUser, String> {
    ChatUser findByUsername(String username);
    List<UsernameOnly> findAllBy();
}