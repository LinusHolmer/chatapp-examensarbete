package se.johan.webservice_uppgift.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import se.johan.webservice_uppgift.model.ChatUser;

import java.util.List;

@Repository
public interface ChatUserRepository extends MongoRepository<ChatUser, String> {
    ChatUser findByUsername(String username);
    List<UsernameOnly> findAllBy();
}