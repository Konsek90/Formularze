enum FieldType {
    TEXT = "TEXT",
    TEXTAREA = "TEXTAREA",
    DATE = "DATE",
    EMAIL = "EMAIL",
    SELECT = "SELECT",
    CHECKBOX = "CHECKBOX"
}

interface Field {
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    etykieta: string,
    typ: FieldType,
    render(rodzic: HTMLElement): void,
    getValue(): string;
}

class FieldLabel {
    static stworz(pole: Field): HTMLLabelElement {
        let etykieta = document.createElement("label");
        etykieta.innerHTML = pole.etykieta;
        etykieta.htmlFor = pole.element.name;
        return etykieta;
    }
}

class InputField implements Field {
    element: HTMLInputElement;
    etykieta: string;
    typ: FieldType;

    constructor(nazwa: string, etykieta: string, typ: FieldType) {
        this.etykieta = etykieta;
        this.element = document.createElement("input");
        this.element.name = nazwa;
        this.element.type = this.typ = typ;
    }

    render(rodzic: HTMLElement): void {
        let labelElement = FieldLabel.stworz(this) as HTMLLabelElement;
        rodzic.appendChild(labelElement);
        rodzic.appendChild(this.element);
    }

    getValue(): string {
        return this.element.value;
    }
}

class TextAreaField implements Field {
    element: HTMLTextAreaElement;
    etykieta: string;
    typ = FieldType.TEXTAREA;

    constructor(nazwa: string, etykieta: string) {
        this.etykieta = etykieta;
        this.element = document.createElement("textarea");
        this.element.name = nazwa;
    }

    render(rodzic: HTMLElement): void {
        let labelElement = FieldLabel.stworz(this) as HTMLLabelElement;
        rodzic.appendChild(labelElement);
        rodzic.appendChild(this.element);
    }

    getValue(): string {
        return this.element.value;
    }
}

class SelectField implements Field {
    element: HTMLSelectElement;
    etykieta: string;
    typ = FieldType.TEXTAREA;

    constructor(nazwa: string, etykieta: string, wartosci: string[]) {
        this.etykieta = etykieta;
        this.element = document.createElement("select");
        this.element.name = nazwa;

        for (const wartosc of wartosci) {
            let optionElement = document.createElement("option");
            optionElement.text = optionElement.value = wartosc;
            this.element.appendChild(optionElement);
        }
    }

    render(rodzic: HTMLElement): void {
        let labelElement = FieldLabel.stworz(this) as HTMLLabelElement;
        rodzic.appendChild(labelElement);
        rodzic.appendChild(this.element);
    }

    getValue(): string {
        return this.element.value;
    }
}

class CheckboxField implements Field {
    element: HTMLInputElement;
    etykieta: string;
    typ = FieldType.CHECKBOX;

    constructor(nazwa: string, etykieta: string) {
        this.etykieta = etykieta;
        this.element = document.createElement("input");
        this.element.name = nazwa;
        this.element.type = this.typ;
    }

    render(rodzic: HTMLElement): void {
        let labelElement = FieldLabel.stworz(this) as HTMLLabelElement;
        rodzic.appendChild(labelElement);
        rodzic.appendChild(this.element);
    }

    getValue(): string {
        return this.element.checked.toString();
    }
}

class Form {
    locStorage = new LocStorage();
    pola: Field[];
    
    constructor(pola: Field[]) {
        this.pola = pola;
    }

    render(rodzic: HTMLElement): void {
        let formularz = document.createElement("form");

        for (const pole of this.pola) {
           pole.render(formularz);
        }
        
        let przyciskWstecz = document.createElement("button");
        przyciskWstecz.type = "button";
        przyciskWstecz.innerHTML = "Wstecz";
        przyciskWstecz.addEventListener("click", (e) => {
            window.location.href = "/index.html";
        });
        formularz.appendChild(przyciskWstecz);

        let przyciskZapisu = document.createElement("button");
        przyciskZapisu.type = "submit";
        przyciskZapisu.innerHTML = "Wyślij";
        przyciskZapisu.addEventListener("click", (e) => {
            this.save();
            e.preventDefault();
        });
        formularz.appendChild(przyciskZapisu);

        rodzic.appendChild(formularz);
    }

    getValue(): any {
        let wartosci: {[key: string]: string} = {};
        
        for (const pole of this.pola) {
            wartosci[pole.element.name] = pole.getValue(); 
        }
        return wartosci;
    }

    save(): void {
        this.locStorage.saveDocument(this.getValue());
    }
}

interface DataStorage {
    saveDocument(wartosci: any): string,
    loadDocument(idDokumentu: string): any,
    getDocuments(): string[]
}

class LocStorage implements DataStorage {
    saveDocument(wartosci: any, id = ""): string {
        if (id === "") {
            id = "document-" + Date.now();
        }
        
        let listaDokumentow = localStorage.getItem("documentList");
        let dokumenty = [];

        if (listaDokumentow !== null) {
            dokumenty = JSON.parse(listaDokumentow);
        }

        if(dokumenty.indexOf(id) > -1) {
            dokumenty.push(id);
        }

        localStorage.setItem("documentList", JSON.stringify(dokumenty));
        localStorage.setItem(id, JSON.stringify(wartosci));

        return id;
    }

    loadDocument(id: string): any {
        return JSON.parse(localStorage.getItem(id)!);    
    }

    getDocuments(): string[] {
        let listaDokumentow = localStorage.getItem("documentList");

        let dokumenty : string[] = [];
 
        if (listaDokumentow !== null) {
            dokumenty = JSON.parse(listaDokumentow);
        }

        return dokumenty;
    }
}

class DocumentList {
    dokumenty: string[] = [];
    locStorage = new LocStorage();

    getDocumentList(): void {
        this.dokumenty = this.locStorage.getDocuments();
    }

    getDocument(id: string) : any {
        return this.locStorage.loadDocument(id);
    }

    render(rodzic: HTMLElement): void {
        let tabela = document.createElement("table");
        let bodyTabeli = tabela.createTBody();

        for (let idDokumentu of this.dokumenty) {
            let dokument = bodyTabeli.insertRow();
            dokument.insertCell().innerHTML = idDokumentu;

            let edycja = document.createElement("a");
            edycja.innerHTML = "Edytuj";
            edycja.href = "edit-document.html?id=" + idDokumentu;

            let usun = document.createElement("a");
            usun.innerHTML = "Usuń";
            usun.href = "#";
            usun.addEventListener("click", () => {

            });

            let przyciski = dokument.insertCell();

            przyciski.appendChild(edycja);
            przyciski.appendChild(usun);
        }

        rodzic.appendChild(tabela);
    }
}

class App {
    inicjacja() {
        let formularz = this.stworzFormularz();
        formularz.render(document.body);
    }

    stworzFormularz(): Form {
        return new Form([
            new InputField("imie", "Imię", FieldType.TEXT),
            new InputField("nazwisko", "Nazwisko", FieldType.TEXT),
            new InputField("email", "E-mail", FieldType.EMAIL),
            new SelectField("kierunek", "Wybrany kierunek studiów", ["Informatyka i Ekonometria", "Finanse i Rachunkowość", "Zarządzanie"]),
            new CheckboxField("elearning", "Czy preferujesz e-learning?"),
            new TextAreaField("uwagi", "Uwagi")
        ]);
    }
}

const APP = new App();
APP.inicjacja();