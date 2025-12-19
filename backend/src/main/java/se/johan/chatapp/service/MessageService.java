package se.johan.chatapp.service;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.web.server.ResponseStatusException;
import se.johan.chatapp.dto.MessageRequest;
import se.johan.chatapp.dto.SentMessageDTO;
import se.johan.chatapp.model.ChatUser;
import se.johan.chatapp.model.Message;
import se.johan.chatapp.repository.ChatUserRepository;
import se.johan.chatapp.repository.MessageRepository;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class MessageService {
    private final ChatUserRepository chatUserRepository;
    private final MessageRepository messageRepository;
    private final MongoTemplate mongoTemplate;

    private final static Logger logger = LoggerFactory.getLogger(MessageService.class);


    public MessageService(ChatUserRepository chatUserRepository, MessageRepository messageRepository, MongoTemplate mongoTemplate) {
        this.chatUserRepository = chatUserRepository;
        this.messageRepository = messageRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public void sendMessage(String username, String body, String receiver) {

        try{

        // Hämta avsändaren
        ChatUser sender = chatUserRepository.findByUsername(username);

        if(sender == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        // Hämta mottagaren
        ChatUser receiverUser = chatUserRepository.findByUsername(receiver);
        if (receiverUser == null) {
            throw new NoSuchElementException("Mottagaren finns inte");
        }

        // Skapa och spara meddelandet
        Message message = new Message();
        message.setSender(sender.getUsername());
        message.setBody(body);
        message.setReceiver(receiverUser.getUsername());
        message.setTimestamp(LocalDateTime.now());

        logger.info("{} sent a message to {}", sender.getUsername(), receiverUser.getUsername());
        messageRepository.save(message);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Du saknar behörighet eller är inte inloggad");
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mottagaren finns inte");
        }
    }

    public Optional<Message> deleteMessage(String username, String receiver){

        ChatUser sender = chatUserRepository.findByUsername(username);

        if(sender == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        //bygger mongodb query, sender = username, receiver = receiver
        Query q = new Query(Criteria.where("sender").is(username).and("receiver").is(receiver));


        //sortera efter tid(timestamp) senaste först
        q.with(Sort.by(Sort.Direction.DESC, "timestamp"));


        //tar bort senase meddelandet
        Message removed = mongoTemplate.findAndRemove(q,Message.class);


        //returnera raderat meddelande eller tomt optional
        logger.info("Successfully removed a message from {}", sender.getUsername());
        return Optional.ofNullable(removed);
    }

    public List<MessageRequest> viewMessages(String username) {
        ChatUser user = chatUserRepository.findByUsername(username);

        if (user == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
            List<Message> messages = messageRepository.findByReceiverOrderByTimestampDesc(user.getUsername());

            List<MessageRequest> result = new ArrayList<>();

            for (Message message : messages) {
                MessageRequest dto = new MessageRequest(message.getSender(), message.getBody(), message.getTimestamp());
                result.add(dto);
            }
            return result;
    }

    public List<SentMessageDTO> viewSentMessages(String username) {
        ChatUser user = chatUserRepository.findByUsername(username);

        if (user == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
            List<Message> messages = messageRepository.findBySenderOrderByTimestampDesc(user.getUsername());
            List<SentMessageDTO> result = new ArrayList<>();

            for (Message message : messages) {
                SentMessageDTO dto = new SentMessageDTO(
                        message.getReceiver(),   // <-- här tar vi mottagaren
                        message.getBody(),
                        message.getTimestamp()
                );
                result.add(dto);
            }
            return result;
    }
    public Message newSendMessage(String username, String body, String receiver) {
        try {
            ChatUser sender = chatUserRepository.findByUsername(username);
            if (sender == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
            }

            ChatUser receiverUser = chatUserRepository.findByUsername(receiver);
            if (receiverUser == null) {
                throw new NoSuchElementException("Mottagaren finns inte");
            }

            Message message = new Message();
            message.setSender(sender.getUsername());
            message.setBody(body);
            message.setReceiver(receiverUser.getUsername());
            message.setTimestamp(LocalDateTime.now());

            logger.info("{} sent a message to {}", sender.getUsername(), receiverUser.getUsername());

            return messageRepository.save(message);

        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Du saknar behörighet eller är inte inloggad"
            );
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Mottagaren finns inte"
            );
        }
    }
}