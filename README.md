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
Partea de server este implementată modular folosind limbajul de programare *nodeJs*. Pentru a facilita dezvoltarea aplicației a fost folosit framework-ul *Express* impreună cu anumite module. Aplicația respectă șablonul de proiectare *Model-View-Controller*. Modelul este reprezentat prin baza de date *NoSQL* **CouchDB**, bază de date care . Pentru afișarea conținutului *HTML* este folosit template-ul *Jade*, iar pentru formatarea elementelor documentelor *HTML* este folosit *Stylus*.

  - Type some Markdown text in the left window
  - See the HTML in the right
  - Magic

Markdown is a lightweight markup language based on the formatting conventions that people naturally use in email.  As [John Gruber] writes on the [Markdown site] [1]:

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable 
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

This text your see here is *actually* written in Markdown! To get a feel for Markdown's syntax, type some text into the left window and watch the results in the right.  

Version
-

2.0

Tech
-----------

Dillinger uses a number of open source projects to work properly:

* [Ace Editor] - awesome web-based text editor
* [Showdown] - a port of Markdown to JavaScript
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]
* [keymaster.js] - awesome keyboard handler lib by [@thomasfuchs]
* [jQuery] - duh 

Installation
--------------

```sh
git clone [git-repo-url] dillinger
cd dillinger
npm i -d
mkdir -p public/files/{md,html,pdf}
node app
```


License
-

MIT

*Free Software, Fuck Yeah!*

  [john gruber]: http://daringfireball.net/
  [@thomasfuchs]: http://twitter.com/thomasfuchs
  [1]: http://daringfireball.net/projects/markdown/
  [showdown]: https://github.com/coreyti/showdown
  [ace editor]: http://ace.ajax.org
  [node.js]: http://nodejs.org
  [Twitter Bootstrap]: http://twitter.github.com/bootstrap/
  [keymaster.js]: https://github.com/madrobby/keymaster
  [jQuery]: http://jquery.com  
  [@tjholowaychuk]: http://twitter.com/tjholowaychuk
  [express]: http://expressjs.com
  

    