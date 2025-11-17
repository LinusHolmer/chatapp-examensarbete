# Loggbok


## 2025-10-24
Skapade upp ett repository.
Klonade ett gammalt projekt som vi vill fortsätta med.

Vi har valt att använda react för våran frontend. Vi valde react eftersom att vi känner oss bekväma med ramverket och det är stort på arbetsmarknaden.
Vi valde att använda mongo db som våran databas. Vi känner oss bekväma med databasen och många använder den på arbetsmarknaden.
Vi skapade en kanban board för att kunna planera vårat arbete enklare. Vi har lagt till några userstories för våran MVP.

## 2025-10-27
La till ny "user story" på kanban, Spring websocket för realtid kommunikation (INTE prio)

## 2025-11-03
Skapade två nya klasser för jwt token generation och auth för logins.
TokenService genererar JWT tokens från en Authenticated user.
AuthController är en REST-controller för login endpoint just nu (Kanske lägger till register också)
La till role variable till ChatUser för att kunna spara roler för användare.

## 2025-11-06
La till så att man får en cookie med token istället för att bara få token.
Gjorde en myUserDetailsService klass som kollar om användaren finns.
Provade i postman och det funkade.
Provade på mer saker i nextjs och fick det att funka.

## 2025-11-10
Tog bort onödig kod i frondend för att hemsidan ska se bättre ut.
La till våran logotyp i hörnet på hemsidan.

Hade problem med next.js då det finns väldigt många autogenererade filer så det blir lite förvirrande.
Kollade på en tutorial för att förstå grunderna.

Bytte ut vår deprecated AuthenticationManager till den nya varianten.
La till en "logout" endpoint i AuthControllern som tar bort den inloggade användarens JWT-token, och loggar ut.
Börjar jobba på login sida för våran frontend.

## 2025-11-11
Skapade loginpage för frontend med klar HTML och CSS.
Skapade en "public-key" endpoint i backend som skickar våran public key i String för jwt.

## 2025-11-13
Börjar koda på en modal(popup fönster) för frontend och hamburgar meny.
Skapade en länk för lägg till vänner. När man klickar på länken så kommer man till en ny sida med ett skrivfält. Man kan skriva in ett användarnamn och klicka på "lägg till". 
Om man klickar på "lägg till" så står det att användaren har lagts till. 
Gjorde också lite css för att få sidan att se snyggare ut. Länkarna ligger på högersidan och loggan på vänstersidan.

Problem: Cookie behöver ett filter för att läsa JWT från frontend, lösning: JwtCookieFilter, vi försöker förstå lösningen bättre det är väldigt nytt för oss.

## 2025-11-14
Gjorde klart modal för frontend och testade, den funkar.
Skapade en enkel registerings sida ingen logik bara HTML och CSS.

Problem: Modal komponent var från ett gammalt projekt och i React så syntaxen var olika från Next.js, lösning: Next.js dokumentation 

## 2025-11-17
La till typescript för loginpage så man kan logga in, la också till cors config så andra URLS kan kommunicera med backend (localhost:3000).

Problem: Fick 401 när jag skicka request till backend, lösning: .secure ska vara (false) när man jobbar med localhost.

