
# Chatapp
En enkel chattjänst byggd i java med Spring boot och MongoDB.
Tjänsten låter användare registrera sig, skicka meddelanden, hämta meddelandehistorik och hitta nya vänner.


## Hur man startar appen
Du startar appen genom att starta WebserviceUppgiftApplication



## 📡 Exempel på API-anrop

### Registrera användare
```http
POST /register
Content-Type: application/json

{
  "username": "johan",
  "password": "hemligt"
}
```


## Vad har vi lärt oss?

Genom det här projektet har vi lärt oss:

- **Webbtjänster**: Hur man bygger REST API:er i Java med Spring Boot, använder olika HTTP-metoder (GET, POST, PUT, DELETE), och returnerar rätt statuskoder (200, 201, 404, 401). Vi har också förstått skillnaden mellan entiteter och DTO:er.

- **Databaser**: Hur man använder en NoSQL-databas (MongoDB) för att spara och hämta data, och hur det skiljer sig från relationsdatabaser.

- **Versionshantering**: Hur Git och GitHub används för att hålla ordning på kod, skapa branches, göra commits och lösa merge-konflikter.

- **Samarbete**: Hur man arbetar i grupp genom att dela upp uppgifter, kommunicera och skriva tydliga commits så att alla förstår varandras kod.


