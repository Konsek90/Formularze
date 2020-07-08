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

    saveForm(wartosci: any, id: string = ""): string {
        if (id === "") {
            id = "form-" + Date.now();
        }
        
        let formList = localStorage.getItem("formList");
        let formularze: string[] = [];

        if (formList !== null) {
            formularze = JSON.parse(formList);
        }

        if(formularze.indexOf(id) < 0) {
            formularze.push(id);
        }

        localStorage.setItem("formList", JSON.stringify(formularze));
        localStorage.setItem(id, JSON.stringify(wartosci));

        return id;
    }

    removeForm(id: string): void {
        localStorage.removeItem(id);

        let formList = localStorage.getItem("formList");
        let formularze: string[] = [];

        if (formList !== null) {
            formularze = JSON.parse(formList);
        }

        if (formularze.indexOf(id) > -1) {
            formularze.splice(formularze.indexOf(id), 1);
        }

        localStorage.setItem("formList", JSON.stringify(formularze));
    }

    loadForm(id: string): any {
        return JSON.parse(localStorage.getItem(id)!);
    }

    getForms(): string[] {
        let formList = localStorage.getItem("formList");
        let forms: string[] = [];
 
        if (formList !== null) {
            forms = JSON.parse(formList);
        }

        return forms;
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

class FormCreator {
    locStorage = new LocStorage();

    newForm(rodzic: HTMLElement): void {
        let formularz = document.createElement("form");

        let dodajPole = document.createElement("button");
        dodajPole.type = "button";
        dodajPole.innerText = "Dodaj";
        dodajPole.addEventListener("click", () => {
            this.generujPole(divFields);
        });
        let usunPole = document.createElement("button");
        usunPole.type = "button";
        usunPole.innerText = "Usuń";
        usunPole.addEventListener("click", () => {     
            divFields.removeChild(divFields.lastChild!);
        });
        formularz.appendChild(dodajPole);
        formularz.appendChild(usunPole);
        
        let divFields = document.createElement("div");
        divFields.id = "pola";

        this.generujPole(divFields);
        formularz.appendChild(divFields);

        let wstecz = document.createElement("button");
        wstecz.type = "button";
        wstecz.innerHTML = "Wstecz"
        wstecz.addEventListener("click", (e) => {
            window.location.href = "/index.html";
        });

        let zapisz = document.createElement("button");
        zapisz.type = "submit";
        zapisz.innerHTML = "Zapisz"
        zapisz.addEventListener("click", (e) => {
            this.saveForm();
            window.location.href = "/form-list.html";
            e.preventDefault();
        });

        formularz.appendChild(wstecz);
        formularz.appendChild(zapisz);

        rodzic.appendChild(formularz);
    }

    getValue(): ZapisanePole[] {
        let values: ZapisanePole[] = [];
        const formFields: HTMLElement = document.getElementById("pola")!;

        for (const formField of formFields.children) {
            let nazwa = formField.querySelector("input[name='nazwaPola']") as HTMLInputElement;
            let etykieta = formField.querySelector("input[name='etykietaPola']") as HTMLInputElement;
            let typ = formField.querySelector("select[name='typPola']") as HTMLSelectElement;
            let opcje = formField.querySelector("input[name='opcjePola']") as HTMLInputElement;
            let domyslnaWartosc = formField.querySelector("input[name='wartoscPola']") as HTMLInputElement;

            let typPola: string = typ.value.toUpperCase();
            let opcjePola: string[] = opcje.value.split("|");

            values.push({
                nazwa: nazwa.value,
                etykieta: etykieta.value,
                typ: (<any>FieldType)[typPola],
                opcje: opcjePola,
                domyslnaWartosc: domyslnaWartosc.value
            });
        }

        return values;
    }

    saveForm(): void {
        this.locStorage.saveForm(this.getValue());
    }

    renderList(rodzic: HTMLElement): void {
        let tabela = document.createElement("table");
        let bodyTabeli = tabela.createTBody();
        let formularze = this.locStorage.getForms();

        for (const idForumlarza of formularze) {
            let dokument = bodyTabeli.insertRow();
            dokument.insertCell().innerHTML = idForumlarza;

            let edycja = document.createElement("a");
            edycja.innerHTML = "Wypełnij";
            edycja.href = "new-document.html?id=" + idForumlarza;

            let usun = document.createElement("a");
            usun.innerHTML = "Usuń";
            usun.href = "#";
            usun.addEventListener("click", () => {
                this.locStorage.removeForm(idForumlarza);
                window.location.reload();
            });

            let przyciski = dokument.insertCell();

            przyciski.appendChild(edycja);
            przyciski.innerHTML += "&nbsp;";
            przyciski.appendChild(usun);
        }

        rodzic.appendChild(tabela);
    }

    private generujPole(rodzic: HTMLElement) {
        let pole = document.createElement("div");
        pole.appendChild(document.createElement("hr"));
        
        let typPola = document.createElement("select");
        typPola.name = "typPola";

        for (let opcja of Object.keys(FieldType)) {
            let el = document.createElement("option");
            el.value = el.text = opcja;

            typPola.appendChild(el);
        }

        typPola.addEventListener("change", () => {
            if (typPola.value === "SELECT") {
                opcjePola.style.display = "block";
            }
            else {
                opcjePola.style.display = "none";
            }
        });

        pole.appendChild(typPola);
        
        let nazwaPola = document.createElement("input");
        nazwaPola.name = "nazwaPola";
        nazwaPola.type = "text";
        nazwaPola.placeholder = "nazwa"
        pole.appendChild(nazwaPola);
        
        let etykietaPola = document.createElement("input");
        etykietaPola.name = "etykietaPola";
        etykietaPola.type = "text";
        etykietaPola.placeholder = "etykieta"
        pole.appendChild(etykietaPola);
        
        let wartoscPola = document.createElement("input");
        wartoscPola.name = "wartoscPola";
        wartoscPola.type = "text";
        wartoscPola.placeholder = "wartość"
        pole.appendChild(wartoscPola);

        let opcjePola = document.createElement("input");
        opcjePola.name = "opcjePola";
        opcjePola.type = "text";
        opcjePola.placeholder = "opcje (oddzielone \"|\")";
        opcjePola.style.display = "none";
        pole.appendChild(opcjePola);

        rodzic.appendChild(pole);
    }
}

class App {
    inicjacja() {
        let documentList = new DocumentList();
        let formCreator = new FormCreator();

        switch (window.location.pathname) {
            case '/new-document.html':
                let idForumlarza = Router.getParam("id")!;

                let formularz: ZapisanePole[] = documentList.getDocument(idForumlarza);

                if (formularz !== null) {
                    let pola = [];

                    for (const fieldInfo of formularz) {
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

                    const form = new Form(pola, idForumlarza);
                    form.render(document.body);
                }
                else {
                    document.body.innerHTML = "Nie znaleziono formularza";
                }
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

            case '/new-form.html':
                formCreator.newForm(document.body);
                break;
            
            case '/form-list.html':
                formCreator.renderList(document.body);
                break;
        }
    }
}

const APP = new App();
APP.inicjacja();