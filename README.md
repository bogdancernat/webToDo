#WebToDo++

 
####Bogdan-Ștefan Cernat, Adrian Gheorghe Schipor

####Facultatea de Informatică, Universitatea Alexandru Ioan Cuza, Iași


 
[bogdan.cernat@info.uaic.ro](bogdan.cernat@info.uaic.ro)

[adrian.schipor@info.uaic.ro](adrian.schipor@info.uaic.ro)
 
 
###Abstract
------------
 
 **WebToDo++** este o aplicație web ce oferă utilizatorilor posibilitatea de a-și organiza sarcinile și proiectele. Utilizatorii pot crea echipe, proiecte și pot adăuga sarcini. În cazul sarcinilor ce beneficiază de un memento, serverul va notifica utilizatorul la ora și data respctivă.
 
 

###Introducere
---------------
 **WebToDo++** ajută utilizatorii să își administreze timpul și sarcinile eficient oferind o cale de a-și organiza activitățile, de a seta priorități și memento-uri pentru sarcini. Avantajul aplicației constă in faptul că poate fi accesată oricând atât timp cât există o conexiune la internet. Aplicația are două moduri de utilizare: cei care nu dețin cont de utilizator pot doar să adauge sarcini și vor fi notificați doar atunci când vor accesa aplicația; cei care dețin cont de utilizator pot crea echipe și proiecte, pot face parte din echipe și pot adăuga sarcini. Astfel, cei care vor să beneficieze de toate facilitățile oferite de această aplicație trebuie să își creeze un cont de utilizator. Deasemenea, aceștia se pot autentifica și folosind contul de Twitter, Google.
 

###Tehnologii folosite
-----------------------

 Partea de server este implementată modular folosind limbajul de programare **JavaScript** și rulează pe platforma **nodeJS**. *nodeJS* este o platformă *open source* care ușurează dezvoltarea de aplicații web scalabile în limbajul *JavaScript*. Această platformă adoptă paradigma bazată pe eventimente, operațiile de intrare fiind asincrone. Pentru a facilita dezvoltarea aplicației a fost folosit framework-ul *Express* impreună cu anumite module. Aplicația respectă șablonul de proiectare *Model-View-Controller*. Modelul este reprezentat prin baza de date *NoSQL* **CouchDB**. Această bază de date stochează datele in documente *JSON* facilitănd dezvoltarea de aplicații web. Deasemenea, este foarte bună pentru crearea de aplicații web scalabile și sigure. Front-end-ul aplicației este realizat folosind *template engine-ul* **Jade**, template folosit pentru genererarea de conținut *HTML*. Pentru formatarea elementelor documentelor *HTML* este folosit *Stylus*. Comunicarea dintre utilizatori și server este realizată folosind modulul *io.sockets*. *io.sockets* este un modul ce oferă suport *cross-browser* pentru comunicarea asincronă dintre client și server, și se poate folosi de *WebSockets*, *Ajax*, *Adobe® Flash® Socket* împreună cu alte modalități de comunicare asincronă, în funcție de capabilitățile navigatorului. 


###Arhitectura aplicației
--------------------------

La baza aplicației stă transmiterea asincronă de mesaje între client și server. Deasemenea, aplicația este dezvoltată după paradigma *REST*. Accesând aplicația, clienții deschid o conexiune cu serverul folosind *io.sockets*. Aplicația oferă pentru utilizatori posibiltatea de a-și crea cont sau de a se autentifica folosind contul de *Twitter* sau de *Google*. Pentru ca utilizatorii să se poată autentifica folosind contul de *Twitter* sau de *Google* aplicația utilizează  modulul *Passport*. Pentru utilizatorii care nu dețin un cont de utilizator, aplicația oferă posibilitatea de a adăuga sarcini și de a fi notificați  la ora și data setată(în cazul sarcinelor ce dețin un memento). Acest lucru este posibil deoarece atunci când un utilizator accesează aplicația și nu are setat niciun cookie, serverul setează un cookie unic pe termen lung pentru a putea identifica sarcinile create de u-tilizator, sarcini care sunt salvate în baza de date împreună cu identificatorul utilizatorului. Pentru cei care dețin cont de utilizator, pe lângă posibilitatea de a adăuga sarcini, aceștia vor fi notificați și prin email, vor putea crea echipe și proiecte, vor putea adăuga alți utilizatori la echipele create de ei și vor putea da sarcini altor utilizatori. 
