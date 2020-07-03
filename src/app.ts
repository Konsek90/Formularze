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
    opcje: any,
    render(rodzic: HTMLElement): void,
    getValue(): string;
}

interface ZapisanePole {
    nazwa: string,
    etykieta: string,
    typ: FieldType,
    opcje: any,
    domyslnaWartosc: string
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
    opcje = null;

    constructor(nazwa: string, etykieta: string, typ: FieldType, wartoscDomyslna: string = "") {
        this.etykieta = etykieta;
        this.element = document.createElement("input");
        this.element.name = nazwa;
        this.element.type = this.typ = typ;
        this.element.value = wartoscDomyslna;
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
    opcje = null;

    constructor(nazwa: string, etykieta: string, wartoscDomyslna: string = "") {
        this.etykieta = etykieta;
        this.element = document.createElement("textarea");
        this.element.name = nazwa;
        this.element.value = wartoscDomyslna;
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
    typ = FieldType.SELECT;
    opcje: string[];

    constructor(nazwa: string, etykieta: string, opcje: string[], wartoscDomyslna: string = "") {
        this.etykieta = etykieta;
        this.element = document.createElement("select");
        this.element.name = nazwa;

        for (const wartosc of opcje) {
            let optionElement = document.createElement("option");
            optionElement.text = optionElement.value = wartosc;
            this.element.appendChild(optionElement);
        }
        this.opcje = opcje;
        this.element.value = wartoscDomyslna;
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
    opcje = null;

    constructor(nazwa: string, etykieta: string, domyslnaWartosc: string = "false") {
        this.etykieta = etykieta;
        this.element = document.createElement("input");
        this.element.name = nazwa;
        this.element.type = this.typ;

        if (domyslnaWartosc == "true") {
            this.element.checked = true;
        }
        else {
            this.element.checked = false;
        }
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
    trybEdycji: boolean;
    idDokumentu: string;
    idForumlarza: string;
    
    constructor(pola: Field[], idForumlarza: string = "", trybEdycji: boolean = false, idDokumentu: string = "") {
        this.pola = pola;
        this.trybEdycji = trybEdycji;
        this.idDokumentu = idDokumentu;
        this.idForumlarza = idForumlarza;
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
            window.location.href = "/document-list.html";
            e.preventDefault();
        });
        formularz.appendChild(przyciskZapisu);

        rodzic.appendChild(formularz);
    }

    getValue(): any {
        let wartosci: ZapisanePole[] = [];
        
        for (const pole of this.pola) {
            wartosci.push({
                nazwa: pole.element.name,
                etykieta: pole.etykieta,
                typ: pole.typ,
                opcje: pole.opcje,
                domyslnaWartosc: pole.getValue()
            });
        }

        return wartosci;
    }

    save(): void {
        if (this.trybEdycji) {
            this.locStorage.saveDocument(this.getValue(), this.idDokumentu);
        }
        else {
            this.locStorage.saveDocument(this.getValue());
        }
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

        if(dokumenty.indexOf(id) === -1) {
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

    removeDocument(id: string): void {

        let listaDokumentow = localStorage.getItem("documentList");
        let dokumenty : string[] = [];

        if (listaDokumentow !== null) {
            dokumenty = JSON.parse(listaDokumentow);
        }

        if (dokumenty.indexOf(id) > -1) {
            dokumenty.splice(dokumenty.indexOf(id), 1);
        }

        localStorage.setItem("documentList", JSON.stringify(dokumenty));
        localStorage.removeItem(id);
    }
}

class DocumentList {
    dokumenty: string[] = [];
    locStorage = new LocStorage();

    getDocumentList(): void {
        this.dokumenty = this.locStorage.getDocuments();
    }

    getDocument(id: string): any {
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
                this.removeDocument(idDokumentu);
                window.location.reload();
            });

            let przyciski = dokument.insertCell();

            przyciski.appendChild(edycja);
            przyciski.innerHTML += "&nbsp;";
            przyciski.appendChild(usun);
        }

        rodzic.appendChild(tabela);
    }

    removeDocument(id: string) : void {
        this.locStorage.removeDocument(id);
    }
}

class Router {
    public static getParam(klucz: string): any {
        const query: string = window.location.search.substr(1);
        const urlParams = new URLSearchParams(query); 
        const param = urlParams.get(klucz);
                
        return param;
    }
}

class App {
    inicjacja() {
        let documentList = new DocumentList();

        switch (window.location.pathname) {
            case '/new-document.html':
                let formularz = new Form([
                    new InputField("imie", "Imię", FieldType.TEXT),
                    new InputField("nazwisko", "Nazwisko", FieldType.TEXT),
                    new InputField("email", "E-mail", FieldType.EMAIL),
                    new SelectField("kierunek", "Wybrany kierunek studiów", ["Informatyka i Ekonometria", "Finanse i Rachunkowość", "Zarządzanie"]),
                    new CheckboxField("elearning", "Czy preferujesz e-learning?"),
                    new TextAreaField("uwagi", "Uwagi")
                ]);
                formularz.render(document.body);
                break;

            case '/edit-document.html':
                let idDokumentu = Router.getParam("id")!;

                let dokument: ZapisanePole[] = documentList.getDocument(idDokumentu);

                if (dokument !== null) {
                    let pola = [];

                    for (const fieldInfo of dokument) {
                        let pole: Field;
            
                        switch (fieldInfo.typ) {
                            case FieldType.TEXT:
                            case FieldType.DATE:
                            case FieldType.EMAIL:
                                pole = new InputField(fieldInfo.nazwa, fieldInfo.etykieta, fieldInfo.typ, fieldInfo.domyslnaWartosc);
                                break;
                        
                            case FieldType.TEXTAREA:
                                pole = new TextAreaField(fieldInfo.nazwa, fieldInfo.etykieta, fieldInfo.domyslnaWartosc);
                                break;
                        
                            case FieldType.SELECT:
                                pole = new SelectField(fieldInfo.nazwa, fieldInfo.etykieta, fieldInfo.opcje, fieldInfo.domyslnaWartosc);
                                break;
                    
                            case FieldType.CHECKBOX:
                                pole = new CheckboxField(fieldInfo.nazwa, fieldInfo.etykieta, fieldInfo.domyslnaWartosc);
                                break;
                        }
            
                        pola.push(pole);
                    }

                    const form = new Form(pola, "", true, idDokumentu);
                    form.render(document.body);
                }
                else {
                    document.body.innerHTML = "Nie znaleziono dokumentu";
                }
                break;
        
            case '/document-list.html':
                documentList.getDocumentList();
                documentList.render(document.body);
                break;
        }
    }
}

const APP = new App();
APP.inicjacja();