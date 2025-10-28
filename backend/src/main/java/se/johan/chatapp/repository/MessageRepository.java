package se.johan.chatapp.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import se.johan.chatapp.model.Message;

import java.util.List;


@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByReceiverOrderByTimestampDesc(String receiver);
    List<Message> findBySenderOrderByTimestampDesc(String sender);
}
