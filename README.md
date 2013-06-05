#WebToDo++

#### Bogdan-Ștefan Cernat, Adrian Gheorghe Schipor

####Facultatea de Informatică, Universitatea Alexandru Ioan Cuza, Iași
[bogdan.cernat@info.uaic.ro](bogdan.cernat@info.uaic.ro)
[adrian.schipor@info.uaic.ro](adrian.schipor@info.uaic.ro)

###Abstract

**WebToDo++** este o aplicație web ce oferă utilizatorilor posibilitatea de a-și organiza sarcinile și proiectele. Utilizatorii pot crea echipe, proiecte și pot adăuga sarcini. În cazul sarcinilor ce beneficiază de un termen limită , serverul va notifica utilizatorul respectiv atunci când termnul limită va expira.


###Introducere
**WebToDo++** pune la dispoziția utilizatorilor posibilitatea de a-și organiza activitățile, astfel administrându-și timpul eficient. Aplicația are două moduri de utilizare: cei care nu dețin cont de utilizator pot doar să adauge sarcini și vor fi notificați doar atunci când vor accesa aplicația; cei care dețin cont de utilizator pot crea echipe și proiecte, pot face parte din echipe și pot adăuga sarcini. Astfel, cei care vor să beneficieze de toate facilitățile oferite de această aplicație trebuie să își creeze un cont de utilizator. Deasemenea, aceștia se pot autentifica și folosind contul de Twitter, Google.

###Tehnologii folosite
Partea de server este implementată modular folosind limbajul de programare *nodeJs*. Pentru a facilita dezvoltarea aplicației a fost folosit framework-ul *Express* impreună cu anumite module. Aplicația respectă șablonul de proiectare *Model-View-Controller*. Modelul este reprezentat prin baza de date *NoSQL* **CouchDB**, bază de date care oferă o mulțime de facilități pentru crearea de aplicații web scalabile și sigure. Pentru afișarea conținutului *HTML* este folosit template-ul *Jade*, iar pentru formatarea elementelor documentelor *HTML* este folosit *Stylus*. Pentru comunicarea dintre utilizatori și server a fost folosit modulul *io.sockets*. Deasemenea, aplicația a fost dezvoltată după paradigma **REST**. *io.sockets* este un modul ce oferă suport *cross-browser* pentru comunicarea asincronă dintre client și server, și se poate folosi de *WebSockets*, *Ajax*, *Adobe® Flash® Socket* împreună cu alte modalități de comunicare asincronă, în funcție de capabilitățile navigatorului.