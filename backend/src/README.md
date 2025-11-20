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

## 2025-11-19
La till en hamburgmeny uppe i högra hörnet. Funderade på om det skulle vara bättre att använda en bild på en hamburgmeny eller om jag skulle använda 3 enkla div-linjer i html. Jag valde att använda div linjer för då kan jag ändra deras utseende hur jag vill.
 
"lägg till vänner" länken i hambyrgmenyn är nu kopplad till våran fungerade "lägg till vänner" sida.
La också till onClick metoder för att öppna menyn så att man ser länkarna under som nu är "lägg till vänner" och "upptäck". Det finns också en onClick metod för att stänga menyn när man klickat på en länk.

Register metod i AuthController(backend) som skapar en ny användare i databasen och sedan med typescript redirectar till loginpage för att logga in och få JWT cookien(flyttades från ChatUserController).
Logout page för testning av logout metoden har skapats. 
Du redirectar också från loginpage till homepage om du lyckas logga in.

Problem: CORS error och 401 error med register metoden, lösning: hade flyttat på register metoden från en controller till en annan och glömt ändra URL:en i SecurityConfig, 401 error var på grund av använding av Entity getter i ny auth token och det fixades av att använda DTO:n(men vi tog bort den logiken i register för att bara kunna få jwt från login metoden, är standarden)
Hade lite problem med att ha kvar meny-ikonen medans menyn va öppen. Jag valde därför att ändra transparensen på meny-ikonen så att den alltid syns
 
+ mergade våra branches till production
 
+ la till 2 nya branches som vi ska börja jobba i nu, modal för olika metoder på homepage, homePage för sjävla layouten för sidan
 
## 2025-11-20
La till en modal för knapparna i hamburgarmenyn.
Skapade en ny komponent som heter CustomButton, det är den nya standardknappen vi använder.

Problem: när man gjorde login/register behövde man klicka knappen två gånger, lösning: type="button" på knappen

