package se.johan.webservice_uppgift.service;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import se.johan.webservice_uppgift.dto.MessageRequest;
import se.johan.webservice_uppgift.dto.SentMessageDTO;
import se.johan.webservice_uppgift.model.ChatUser;
import se.johan.webservice_uppgift.model.Message;
import se.johan.webservice_uppgift.repository.ChatUserRepository;
import se.johan.webservice_uppgift.repository.MessageRepository;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class MessageService {

    private final ChatUserRepository chatUserRepository;
    private final MessageRepository messageRepository;
    private final PasswordEncoder passwordEncoder;
    private final MongoTemplate mongoTemplate;


    public MessageService(ChatUserRepository chatUserRepository, MessageRepository messageRepository, PasswordEncoder passwordEncoder, MongoTemplate mongoTemplate) {
        this.chatUserRepository = chatUserRepository;
        this.messageRepository = messageRepository;
        this.passwordEncoder = passwordEncoder;
        this.mongoTemplate = mongoTemplate;
    }

    public Message sendMessage(String username, String rawPassword, String body, String receiver) {
        // Hämta avsändaren
        ChatUser sender = chatUserRepository.findByUsername(username);

        if (sender == null || !passwordEncoder.matches(rawPassword, sender.getPassword())) {
            throw new IllegalArgumentException("Fel användarnamn eller lösenord");
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

        return messageRepository.save(message);
    }


    public Optional<Message> deleteMessage(String username, String rawPassword, String receiver){
        ChatUser user = chatUserRepository.findByUsername(username);

        //kollar om användare finns och om lösenordet matchar hashat lösenord
        if(user == null || !passwordEncoder.matches(rawPassword, user.getPassword())){
            return Optional.empty();
        }
        //bygger mongodb query, sender = username, receiver = receiver
        Query q = new Query(Criteria.where("sender").is(username).and("receiver").is(receiver));


        //sortera efter tid(timestamp) senaste först
        q.with(Sort.by(Sort.Direction.DESC, "timestamp"));


        //tar bort senase meddelandet
        Message removed = mongoTemplate.findAndRemove(q,Message.class);


        //returnera raderat meddelande eller tomt optional
        return Optional.ofNullable(removed);
    }


    public List<MessageRequest> viewMessages(String username, String password) {
        ChatUser user = chatUserRepository.findByUsername(username);

        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            List<Message> messages = messageRepository.findByReceiverOrderByTimestampDesc(user.getUsername());

            List<MessageRequest> result = new ArrayList<>();

            for (Message message : messages) {
                MessageRequest dto = new MessageRequest(message.getSender(), message.getBody(), message.getTimestamp());
                result.add(dto);
            }
            return result;
        }
        return Collections.emptyList();
    }


    public List<SentMessageDTO> viewSentMessages(String username, String password) {
        ChatUser user = chatUserRepository.findByUsername(username);

        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
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
        return Collections.emptyList();
    }






}

