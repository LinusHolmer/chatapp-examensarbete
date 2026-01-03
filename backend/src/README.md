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
Skapade två nya klasser för jwt token generation och auth för logins. 
TokenService genererar JWT tokens från en Authenticated user.
AuthController är en REST-controller för login endpoint just nu (Kanske lägger till register också)
La till role variable till ChatUser för att kunna spara roler för användare.
