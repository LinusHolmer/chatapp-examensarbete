package se.johan.chatapp.dto;

import java.util.List;

public class MessagesResponse {
    private List<MessageRequest> receivedMessages;
    private List<SentMessageDTO> sentMessages;

    public MessagesResponse(List<MessageRequest> receivedMessages, List<SentMessageDTO> sentMessages) {
        this.receivedMessages = receivedMessages;
        this.sentMessages = sentMessages;
    }

    public List<MessageRequest> getReceivedMessages() {
        return receivedMessages;
    }

    public void setReceivedMessages(List<MessageRequest> receivedMessages) {
        this.receivedMessages = receivedMessages;
    }

    public List<SentMessageDTO> getSentMessages() {
        return sentMessages;
    }

    public void setSentMessages(List<SentMessageDTO> sentMessages) {
        this.sentMessages = sentMessages;
    }
}
