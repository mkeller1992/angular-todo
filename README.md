# Dokumentation zur Todo App von Simon Herrmann und Matthias Keller

## Anleitung zur Benutzung der Applikation

**URL der Demo-Applikation:** http://147.87.116.6:5037/ (die App ist auf einem Server im Rolex-Gebäude in Biel gehostet).

Auf dem Startbildschirm können Sie unten rechts auf **«Registrieren»** klicken, falls Sie ein neues Login erstellen möchten. **Nach dem erfolgreichen Einloggen** stehen Ihnen folgende Möglichkeiten offen:

**Navigieren zu unterschiedlichen Kalenderdaten:** Mit einem Klick auf den «Select Date»-Button oben links können Sie einen verborgenen Kalender aufrufen. Rechts neben dem Kalender finden Sie ein Pfeilsymbol, über das sie den Kalender bei Bedarf wieder ausblenden können.

**Hinzufügen eines Todos:** Ein neues Todo erstellen können Sie einerseits via «Add Todo»-Button oben links (nur bei zugeklapptem Kalender) oder durch Klick auf das blaue Plus-Symbol neben dem gewünschten Datum in der Wochenübersicht. In der anschliessend erscheinenden Inputmaske ist das Feld «Categories» als Autocomplete implementiert. Beachten Sie zudem die Möglichkeit wöchentlich wiederkehrende Tasks zu definieren, indem Sie die Checkbox «Weekly recurring» selektieren.

**Bestehende Tasks ändern, löschen oder abschliessen:** Klicken Sie dazu auf den gewünschten Eintrag in der Todo-Tabelle. Achtung: Einmal abgeschlossene Tasks können nicht mehr editiert werden.
Todo-Kategorien ein-/ausblenden: Oben rechts befindet sich ein Multi-Select, wo Sie Todos bestimmter Kategorien via Klick auf das entsprechende x-Symbol ausblenden können. Im Weiteren sehen Sie rechts innerhalb des Multi-Select einen nach unten gerichteten grauen Pfeil, der Sie zu einer Auswahl mit sämtlichen verfügbaren Kategorien führt.

**Kategorien erstellen/ entfernen:** Sobald beim Erstellen oder Editieren eine Category angegeben wird, die zuvor noch nicht vorhanden war, wird automatisch eine neue Todo-Kategorie angelegt. Wenn das letzte Todo-Item einer Kategorie gelöscht wird, bewirkt dies gleichzeitig die (vorläufige) Entfernung der entsprechenden Kategorie.

**Logout:** Der Logout-Button befindet sich oben rechts in der Top-Navbar. Es kann vorkommen, dass während der Verwendung der Applikation der Bearer-Token seine Gültigkeit verliert. In diesem Falle wird der User automatisch ausgeloggt und auf den Login-Screen weitergeleitet.


## Die wichtigsten Bestandteile der Applikation im Überblick ##

**App-Folder**
Das App-Folder umfasst u.a. folgende grundlegende Applikations-Bestandteile:
-	**App-Component:** Bildet (innerhalb der index.html) sozusagen den «Rahmen» der Single-Page-Applikation.
-	**App-Module:** Hier müssen sich beim Aufstarten der App alle Components registrieren.
-	**App-Routing.Module:** Umfasst das Mapping der App-URLs auf die Components.

Das App-Folder enthält zudem nachfolgende Sub-Folders:

**Core**
Das Herzstück der Applikation. Es umfasst jene Components, welche (Partial-)Views mit einem spezifischen Inhalt repräsentieren wie z.B. die Login-Component, die Calendar-View oder die Top-Navbar (im Gegensatz zu den generischen form-control Components).
- core/views/***calendar-view:*** Enthält die eigentliche Main-View
-	core/***edit-overlay:*** Enthält das Popup, in dem ein Todo erstellt/editiert oder gelöscht werden kann.

**Form-controls**
Enthält Components, welche wiederverwendbare Form-Elements darstellen, wie z.B. ein Input-Field oder ein Multi-Select.

**Models**
Enthält die Definitionen der Model-Klassen.

**Services**
Beinhaltet «zentrale Dienste» (häufig Singletons), welche potenziell in jede andere Component injected und dort dann genutzt werden können.
-	**Base.service:** Wird in andere Services injected und enthält grundlegende Variablen-Definitionen und Properties wie z.B. das User-Objekt.
-	**Auth.service:** Bildet beim Login und bei der Registrierung eines neuen Users die Schnittstelle zum Web-Api.
-	**Auth-guard.service:** Prüft beim Aufruf einer App-URL, ob der User authentisiert ist und leitet ihn im negativen Fall auf die Login-Seite weiter.
-	**Message.service:** Ermöglicht die Anzeige von Dialog-Messages sowie von Success und Error-Notifications.
-	**Todo.Services:** Bildet für das Abrufen, Erstellen, Updaten und Löschen von Todos die Schnittstelle zum Web-Api. Fungiert zudem als eine Art Zwischenspeicher (Data-Store) für die komplette Todo-Liste sowie für die Listen mit den Todo-Kategorien.

## Parallelen / Unterschiede zwischen VanillaJS Applikation und unserer Angular-App ##

**Programmiersprache**
Der wohl offensichtlichste Unterschied zur VanillaJS-App beruht darin, dass beim Arbeiten mit dem Angular-Framework nicht Javascript-Funktionen, sondern Typescript-Methoden implementiert werden. Gerade für C-Sharp und Java-Entwickler fühlt sich Typescript sofort sehr vertraut an.

**Struktur der Applikationen**
Eine Angular Applikation ist grundsätzlich ziemlich ähnlich aufgebaut wie die im Unterricht vorgestellte Plain Javascript SPA.
Eine typische Angular Applikation wird ebenfalls in einzelne Komponenten aufgesplittet auf die grundsätzlich von aussen nicht zugegriffen werden kann (womöglich sind die Components im Hintergrund als IFI implementiert?). Ähnlich wie bei der VanillaJS-App umfasst jede Component ein Template (entweder Inline oder in einem separaten html-File) sowie damit verknüpfte Methoden und Properties.

**Authentisierung/ Autorisierung**
Offenbar arbeitet die Vanilla-SPA durchgehend mit Basic Authentication, obwohl das Web-API nach dem Login ein Bearer-Token retourniert. Unsere eigene Todo-Applikation speichert nach dem Einloggen das Bearer-Token (zusammen mit dem Username) im Local Storage. Im Header der anschliessenden API-Requests wird anstelle von Username/Password das Token mitgegeben. Der User bleibt somit nach einem Hard-Refresh oder beim Öffnen der App in einem neuen Browser-Tab eingeloggt, ohne dass wir das User-Passwort im Lokal Storage persistieren müssen.

**Data Store / State Management**
Zentrale Datenprovider werden bei Angular «Services» genannt. Analog zur VanillaJS-App greifen die einzelnen Components unserer Todo-App lesend und schreibend auf den Service zu und sind dafür verantwortlich, dass die Daten im Service aktuell bleiben. Da die Components via Getters und Setters auf einen gemeinsamen Service zugreifen, ist auch sichergestellt, dass alle Components stehts über dieselben Daten verfügen.
Zusätzlich zum Austausch von Daten/Infos via Service oder URL-Parameters existiert in Angular die Möglichkeit des direkten Datenaustausch zwischen «benachbarten» Compnents. Der @Input-Decorator ermöglicht die Daten-Übergabe von Parent- zu Child-Component. Umgekehrt ermöglicht ein mit @Output dekorierter EventEmitter in der Child-Component, dass Daten/Notifikationen an die Parent-Component übermittelt werden können.
Im Unterschied zum store.js der VanillaJS-App ist unser Todo-Service nicht nur ein Data-Store, sondern zusätzlich die Schnittstelle zum WebApi, welche via Ajax-Requests Daten anfordert und persistiert. Bereits in mittelgrossen Applikationen gibt es oftmals mehrere Components, welche auf denselben HTTP-Request zurückgreifen müssen. Um Code-Duplizität zu vermeiden, wird der Code für die http-Requests daher in einen zentralen Service ausgelagert.

**Routing**
Als Gegenstück zum Router-Objekt in der VanillaJS-Applikation existiert im Angular das «App-Routing.Module», welches Routen auf Components mappt. Analog zur VanillaJS-App triggert der Angular-Router zunächst die Überprüfung, ob der Anfrager für den Zugriff auf die gewünschte Route/Sub-Route überhaupt berechtigt ist. Im Routing.Module bewirkt die Code-Zeile «canActivate: [AuthGuard]» eine Umleitung zum Auth-Guard-Service. Letzterer prüft ob der User eingeloggt und zugriffsberechtigt ist und somit das angeforderte Routing durchgeführt werden darf. Im Unterschied zu router.js in der VanillaJS-App sieht man im Angular-Router auf einen Blick, welche Route welcher Component zugeordnet ist und welche Routen eine Berechtigungsprüfung erfordern.
Unser Todo-Projekt war von Beginn weg so konzipiert, dass der User innerhalb der Kalender-App navigiert ohne dass sich dabei die URL verändert. Als die entsprechende (implizite) Anforderung im Rahmen des Unterrichts erwähnt wurde, war unser App-Projekt bereits sehr weit fortgeschritten. Wir haben uns schliesslich gegen einen entsprechenden Umbau der Applikation entschieden, da unser App-Projekt bereits ohne dieses Feature sehr zeitaufwändig war.
Nachfolgend eine kurze Erläuterung, wie wir die angezeigten App-Inhalte stärker an die Parameter der URL hätten koppeln können: Zunächst müsste sich die CalendarView-Component auf den ActivatedRoute-Service subscriben, damit sie in der Lage ist (variable) Path-Parameter und/oder den Query-String der URL abzufangen. Wenn nun der User einen Link anklickt wird via router.navigate() die passende URL gesetzt, bspw. www.meinetodos.ch?add=12-12-2020. Die CalendarView-Component kann das «add»-Keyword zusammen mit dem Datum abfangen und daraufhin den Modal mit der Eingabe-Maske triggern, inklusive vorausgefülltem Fälligkeitstermin. Bei unserer eigenen Todo-App löst der Button-Klick stattdessen direkt das Öffnen der Edit-Maske aus, ohne Umweg über router.navigate().

**Asynchrone Aufrufe**
Anders als in einer VanillaJS App werden in Angular selten Promises verwendet (obwohl dies technisch natürlich auch möglich wäre). Stattdessen wird mit Observables der Rxjs-Bibliothek gearbeitet. Bspw. verwendet das http-Modul von Angular Observables um AJAX-requests und responses zu handeln. Observables haben u.a. den Vorteil, dass die Verbindung zu ihnen nicht zwangsläufig beim ersten Callback wieder abbrechen muss (im Gegensatz zum resolve/reject beim Promise). Stattdessen kann bis zum freiwilligen Unsubscribe ein fortwährender «Stream of values» empfangen und verarbeitet werden; z.B. im Falle eines Typeahead wo der Subscriber nach jedem Tastenanschlag eine neue Benachrichtigung empfängt.



