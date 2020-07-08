"use strict";
var FieldType;
(function (FieldType) {
    FieldType["TEXT"] = "TEXT";
    FieldType["TEXTAREA"] = "TEXTAREA";
    FieldType["DATE"] = "DATE";
    FieldType["EMAIL"] = "EMAIL";
    FieldType["SELECT"] = "SELECT";
    FieldType["CHECKBOX"] = "CHECKBOX";
})(FieldType || (FieldType = {}));
class FieldLabel {
    static stworz(pole) {
        let etykieta = document.createElement("label");
        etykieta.innerHTML = pole.etykieta;
        etykieta.htmlFor = pole.element.name;
        return etykieta;
    }
}
class InputField {
    constructor(nazwa, etykieta, typ, wartoscDomyslna = "") {
        this.opcje = null;
        this.etykieta = etykieta;
        this.element = document.createElement("input");
        this.element.name = nazwa;
        this.element.type = this.typ = typ;
        this.element.value = wartoscDomyslna;
    }
    render(rodzic) {
        let labelElement = FieldLabel.stworz(this);
        rodzic.appendChild(labelElement);
        rodzic.appendChild(this.element);
    }
    getValue() {
        return this.element.value;
    }
}
class TextAreaField {
    constructor(nazwa, etykieta, wartoscDomyslna = "") {
        this.typ = FieldType.TEXTAREA;
        this.opcje = null;
        this.etykieta = etykieta;
        this.element = document.createElement("textarea");
        this.element.name = nazwa;
        this.element.value = wartoscDomyslna;
    }
    render(rodzic) {
        let labelElement = FieldLabel.stworz(this);
        rodzic.appendChild(labelElement);
        rodzic.appendChild(this.element);
    }
    getValue() {
        return this.element.value;
    }
}
class SelectField {
    constructor(nazwa, etykieta, opcje, wartoscDomyslna = "") {
        this.typ = FieldType.SELECT;
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
    render(rodzic) {
        let labelElement = FieldLabel.stworz(this);
        rodzic.appendChild(labelElement);
        rodzic.appendChild(this.element);
    }
    getValue() {
        return this.element.value;
    }
}
class CheckboxField {
    constructor(nazwa, etykieta, domyslnaWartosc = "false") {
        this.typ = FieldType.CHECKBOX;
        this.opcje = null;
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
    render(rodzic) {
        let labelElement = FieldLabel.stworz(this);
        rodzic.appendChild(labelElement);
        rodzic.appendChild(this.element);
    }
    getValue() {
        return this.element.checked.toString();
    }
}
class Form {
    constructor(pola, idForumlarza = "", trybEdycji = false, idDokumentu = "") {
        this.locStorage = new LocStorage();
        this.pola = pola;
        this.trybEdycji = trybEdycji;
        this.idDokumentu = idDokumentu;
        this.idForumlarza = idForumlarza;
    }
    render(rodzic) {
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
    getValue() {
        let wartosci = [];
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
    save() {
        if (this.trybEdycji) {
            this.locStorage.saveDocument(this.getValue(), this.idDokumentu);
        }
        else {
            this.locStorage.saveDocument(this.getValue());
        }
    }
}
class LocStorage {
    saveDocument(wartosci, id = "") {
        if (id === "") {
            id = "document-" + Date.now();
        }
        let listaDokumentow = localStorage.getItem("documentList");
        let dokumenty = [];
        if (listaDokumentow !== null) {
            dokumenty = JSON.parse(listaDokumentow);
        }
        if (dokumenty.indexOf(id) === -1) {
            dokumenty.push(id);
        }
        localStorage.setItem("documentList", JSON.stringify(dokumenty));
        localStorage.setItem(id, JSON.stringify(wartosci));
        return id;
    }
    loadDocument(id) {
        return JSON.parse(localStorage.getItem(id));
    }
    getDocuments() {
        let listaDokumentow = localStorage.getItem("documentList");
        let dokumenty = [];
        if (listaDokumentow !== null) {
            dokumenty = JSON.parse(listaDokumentow);
        }
        return dokumenty;
    }
    removeDocument(id) {
        let listaDokumentow = localStorage.getItem("documentList");
        let dokumenty = [];
        if (listaDokumentow !== null) {
            dokumenty = JSON.parse(listaDokumentow);
        }
        if (dokumenty.indexOf(id) > -1) {
            dokumenty.splice(dokumenty.indexOf(id), 1);
        }
        localStorage.setItem("documentList", JSON.stringify(dokumenty));
        localStorage.removeItem(id);
    }
    saveForm(wartosci, id = "") {
        if (id === "") {
            id = "form-" + Date.now();
        }
        let formList = localStorage.getItem("formList");
        let formularze = [];
        if (formList !== null) {
            formularze = JSON.parse(formList);
        }
        if (formularze.indexOf(id) < 0) {
            formularze.push(id);
        }
        localStorage.setItem("formList", JSON.stringify(formularze));
        localStorage.setItem(id, JSON.stringify(wartosci));
        return id;
    }
    removeForm(id) {
        localStorage.removeItem(id);
        let formList = localStorage.getItem("formList");
        let formularze = [];
        if (formList !== null) {
            formularze = JSON.parse(formList);
        }
        if (formularze.indexOf(id) > -1) {
            formularze.splice(formularze.indexOf(id), 1);
        }
        localStorage.setItem("formList", JSON.stringify(formularze));
    }
    loadForm(id) {
        return JSON.parse(localStorage.getItem(id));
    }
    getForms() {
        let formList = localStorage.getItem("formList");
        let forms = [];
        if (formList !== null) {
            forms = JSON.parse(formList);
        }
        return forms;
    }
}
class DocumentList {
    constructor() {
        this.dokumenty = [];
        this.locStorage = new LocStorage();
    }
    getDocumentList() {
        this.dokumenty = this.locStorage.getDocuments();
    }
    getDocument(id) {
        return this.locStorage.loadDocument(id);
    }
    render(rodzic) {
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
    removeDocument(id) {
        this.locStorage.removeDocument(id);
    }
}
class Router {
    static getParam(klucz) {
        const query = window.location.search.substr(1);
        const urlParams = new URLSearchParams(query);
        const param = urlParams.get(klucz);
        return param;
    }
}
class FormCreator {
    constructor() {
        this.locStorage = new LocStorage();
    }
    newForm(rodzic) {
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
            divFields.removeChild(divFields.lastChild);
        });
        formularz.appendChild(dodajPole);
        formularz.appendChild(usunPole);
        let divFields = document.createElement("div");
        divFields.id = "pola";
        this.generujPole(divFields);
        formularz.appendChild(divFields);
        let wstecz = document.createElement("button");
        wstecz.type = "button";
        wstecz.innerHTML = "Wstecz";
        wstecz.addEventListener("click", (e) => {
            window.location.href = "/index.html";
        });
        let zapisz = document.createElement("button");
        zapisz.type = "submit";
        zapisz.innerHTML = "Zapisz";
        zapisz.addEventListener("click", (e) => {
            this.saveForm();
            window.location.href = "/form-list.html";
            e.preventDefault();
        });
        formularz.appendChild(wstecz);
        formularz.appendChild(zapisz);
        rodzic.appendChild(formularz);
    }
    getValue() {
        let values = [];
        const formFields = document.getElementById("pola");
        for (const formField of formFields.children) {
            let nazwa = formField.querySelector("input[name='nazwaPola']");
            let etykieta = formField.querySelector("input[name='etykietaPola']");
            let typ = formField.querySelector("select[name='typPola']");
            let opcje = formField.querySelector("input[name='opcjePola']");
            let domyslnaWartosc = formField.querySelector("input[name='wartoscPola']");
            let typPola = typ.value.toUpperCase();
            let opcjePola = opcje.value.split("|");
            values.push({
                nazwa: nazwa.value,
                etykieta: etykieta.value,
                typ: FieldType[typPola],
                opcje: opcjePola,
                domyslnaWartosc: domyslnaWartosc.value
            });
        }
        return values;
    }
    saveForm() {
        this.locStorage.saveForm(this.getValue());
    }
    renderList(rodzic) {
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
    generujPole(rodzic) {
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
        nazwaPola.placeholder = "nazwa";
        pole.appendChild(nazwaPola);
        let etykietaPola = document.createElement("input");
        etykietaPola.name = "etykietaPola";
        etykietaPola.type = "text";
        etykietaPola.placeholder = "etykieta";
        pole.appendChild(etykietaPola);
        let wartoscPola = document.createElement("input");
        wartoscPola.name = "wartoscPola";
        wartoscPola.type = "text";
        wartoscPola.placeholder = "wartość";
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
                let idForumlarza = Router.getParam("id");
                let formularz = documentList.getDocument(idForumlarza);
                if (formularz !== null) {
                    let pola = [];
                    for (const fieldInfo of formularz) {
                        let pole;
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
                let idDokumentu = Router.getParam("id");
                let dokument = documentList.getDocument(idDokumentu);
                if (dokument !== null) {
                    let pola = [];
                    for (const fieldInfo of dokument) {
                        let pole;
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
