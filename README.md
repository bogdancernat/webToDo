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

 Partea de server este implementată modular folosind limbajul de programare **JavaScript** și rulează pe platforma **nodeJS**. *nodeJS* este o platformă *open source* care ușurează dezvoltarea de aplicații web scalabile în limbajul *JavaScript*. Această platformă adoptă paradigma bazată pe eventimente, operațiile de intrare fiind asincrone. Pentru a facilita dezvoltarea aplicației a fost folosit framework-ul *Express* impreună cu anumite module. Pentru salvarea datelor a fost folosită baza de date *NoSQL* **CouchDB**. Această bază de date stochează datele in documente *JSON* facilitănd dezvoltarea de aplicații web. Deasemenea, este potrivită pentru crearea de aplicații web scalabile și sigure. Front-end-ul aplicației este realizat folosind *template engine-ul* **Jade**, template folosit pentru genererarea de conținut *HTML*. Pentru formatarea elementelor documentelor *HTML* este folosit *Stylus*. Comunicarea dintre utilizatori și server este realizată folosind modulul *io.sockets*. *io.sockets* este un modul ce oferă suport *cross-browser* pentru comunicarea asincronă dintre client și server, și se poate folosi de *WebSockets*, *Ajax*, *Adobe® Flash® Socket* împreună cu alte modalități de comunicare asincronă, în funcție de capabilitățile navigatorului. Pentru a permite autentificarea folosind contul de *Google* sau de *Twitter* aplicația folosește modulul *Passport*, modul ce oferă un API pentru autentificarea la o mulțime de aplicații web. Pentru notificarea utilizatorilor atunci când una din sarcini expiră, aplicația folosește modulele *Nodemailer*, *Twit* și *Cron*. Modulul *Nodemailer* este folosit pentru a trimite emailuri utilizatorilor, modulul *Twit* pentru a trimite mesaje directe utilizatorilor ce s-au autentificat folosind contul de *Twitter* iar modul *Cron* este folosit pentru a notifica utilizatorii exact la data setată de ei. 

###Arhitectura aplicației
--------------------------

La baza aplicației stă transmiterea asincronă de mesaje între client și server. Deasemenea, aplicația este dezvoltată după paradigma *REST*. Aplicația este structurată pe 3 niveluri: *prezentare*, *logică*, *model*.

Nivelul *prezentare* este reprezentat de interfața aplicației. Când utilizatorii accesează aplicația aceștia pot adăuga sarcini, îsi pot crea un cont de utilizator sau se pot autentifica la aplicație. La crearea sarcinilor cât și la crearea unui nou cont de utilizator, aplicația validează în timp real datele introduse de ei, semnalând orice eroare.  Pentru utilizatorii care nu dețin un cont de utilizator, aplicația oferă posibilitatea de a adăuga sarcini și de a fi notificați  la ora și data setată(în cazul sarcinelor ce dețin un memento). Acest lucru este posibil deoarece atunci când un utilizator accesează aplicația și nu are setat niciun cookie, serverul setează un cookie unic pe termen lung pentru a putea identifica sarcinile create de utilizator, sarcini care sunt salvate în baza de date împreună cu identificatorul utilizatorului. Pentru cei care dețin cont de utilizator, pe lângă posibilitatea de a adăuga sarcini, aceștia sunt notificați prin email sau prin *Twitter*(în cazul utilizării contului de *Twitter*), pot crea echipe și proiecte, și pot adăuga alți utilizatori la echipele create de ei. 

Nivelul *logică* este reprezentat de *controllerul* aplicației. Acesta  a fost modularizat astfel încât orice eroare să poată fi găsită ușor și, deasemenea, orice schimbare să poată fi făcută ușor. Astfel, *controllerul* este format dintr-un modul ce se ocupă cu lucrul asupra bazei de date, un modul ce se ocupă cu autentificarea și un modul ce se ocupă cu comunicarea dintre client și server. Accesând aplicația, clienții inițializează două conexiuni cu serverul folosind *socket-uri*. Atunci când utilizatorul introduce date invalide la crearea unui cont de utilizator, acestuia nu-i este permis să trimită datele către server. Dacă acesta totuși ar reuși să trimită date invalide către server, va fi redirectat înapoi către pagina principală. Serverul se ocupă de validarea tuturor datelor, chiar dacă în client uneori nu sunt permise anumite acțiuni din cauza datelor invalide. Pentru comunicarea dintre client și server s-au folosit două socket-uri: un socket a fost folosit pentru transmiterea datelor de la client la server, pentru validări și notificări iar un socket a fost folosit pentru transmiterea sarcinelor și proiectelor de la server către client la accesarea aplicației. De fiecare dată când o nouă sarcină este trimisă către server, acesta o validează și o trimite înapoi la client(în cazul în care aceasta este validă) sau trimite un mesaj de eroare clientului(în cazul în care aceasta nu este validă). Deoarece sarcinile sunt salvate în baza de date împreună cu id-ul utilizatorului care le-a creat și deoarece la introducerea unei noi sarcini datele sunt trimise folosind un socket, serverul folosește modulul *Cookie* pentru a extrage din cookie id-ul utilizatorului care a creat sarcina. În fiecare zi, la ora 0:00, serverul selectează din baza de date toate sarcinile a căror dată coincide cu data curentă și notifică utilizatorii. Utilizatorii ce s-au autentificat folosind contul de *Google* sau printr-un cont de utilizator creat din cadrul aplicației sunt notificați prin email. Cei care s-au autentificat folosind contul de la *Twitter* sunt notificați prin mesaje directe către contul de *Twitter*, deoarece cei de la *Twitter* nu pun la dispoziție adresa de email asociată contului. 

Nivelul *model* este reprezentat prin baza de date **NoSQL** *CouchDB*. Deoarece serverul a fost scris în limbajul *JavaScript* utilizarea acestei baze de date a facilitat dezvoltarea aplicației. Fiecare cont de utilizator este reprezentat în baza de date printr-un document JSON. Deasemnea, sarcinile și proiectele sunt reprezentate prin documente JSON. 


###Detalii de implementare
--------------------------

Atunci când un utilizator își creează un nou cont de utilizator, serverul validează datele. Adresa de email este verificată folosind o expresie regulată. Parola trebuie să conțină cel putin 6 caractere și cel mult 30 de caractere, doar litere și numere. Deasemnea, atunci când utilizatorul confirmă parola, severul verifică dacă parolele coincid. În cazul unei erori, serverul notifică clientul iar acesta nu este lăsat să trimită formularul către server. Toate aceste validări sunt realizate în timp real, asincron. 
La autentificare, serverul verifică datele atunci când butonul *login* este apăsat. Dacă datele nu sunt valide, serverul semnalează erorile. Dacă datele sunt valide, este setat un cookie ce conține email-ul utilizatorului sau numele de cont(în cazul utilizatorilor autentificați folosind contul de *Twitter*). Pagina principală este formată dintr-un *layout* ce contine proiectele utilizatorului, un *layout* ce conține sarcinile proiectului selectat și un layout pentru notificări. --img--here-- 
Atunci când utilizatorul creează o sarcină sau un proiect, datele sunt transmise către client folosind un socket. Atunci când utilizatorul apasă butonul pentru a trimite datele către server, este trimis un semnal(specific fiecărei acțiuni) către server împreună cu datele ce necesită validae. În server, atunci când apare un semnal, acesta efectuează validările și emite un semnal împreună cu un mesaj de eroare(dacă datele nu sunt valide) sau cu datele validate, dacă datele sunt valide. --img--here--

La crearea sarcinilor, utilizatorii pot să introducă un memento(sau dată la care expiră sarcina). Deoarece la deschiderea serverului este 