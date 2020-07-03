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
var FieldLabel = /** @class */ (function () {
    function FieldLabel() {
    }
    FieldLabel.stworz = function (pole) {
        var etykieta = document.createElement("label");
        etykieta.innerHTML = pole.etykieta;
        etykieta.htmlFor = pole.element.name;
        return etykieta;
    };
    return FieldLabel;
}());
var InputField = /** @class */ (function () {
    function InputField(nazwa, etykieta, typ, wartoscDomyslna) {
        if (wartoscDomyslna === void 0) { wartoscDomyslna = ""; }
        this.opcje = null;
        this.etykieta = etykieta;
        this.element = document.createElement("input");
        this.element.name = nazwa;
        this.element.type = this.typ = typ;
        this.element.value = wartoscDomyslna;
    }
    InputField.prototype.render = function (rodzic) {
        var labelElement = FieldLabel.stworz(this);
        rodzic.appendChild(labelElement);
        rodzic.appendChild(this.element);
    };
    InputField.prototype.getValue = function () {
        return this.element.value;
    };
    return InputField;
}());
var TextAreaField = /** @class */ (function () {
    function TextAreaField(nazwa, etykieta, wartoscDomyslna) {
        if (wartoscDomyslna === void 0) { wartoscDomyslna = ""; }
        this.typ = FieldType.TEXTAREA;
        this.opcje = null;
        this.etykieta = etykieta;
        this.element = document.createElement("textarea");
        this.element.name = nazwa;
        this.element.value = wartoscDomyslna;
    }
    TextAreaField.prototype.render = function (rodzic) {
        var labelElement = FieldLabel.stworz(this);
        rodzic.appendChild(labelElement);
        rodzic.appendChild(this.element);
    };
    TextAreaField.prototype.getValue = function () {
        return this.element.value;
    };
    return TextAreaField;
}());
var SelectField = /** @class */ (function () {
    function SelectField(nazwa, etykieta, opcje, wartoscDomyslna) {
        if (wartoscDomyslna === void 0) { wartoscDomyslna = ""; }
        this.typ = FieldType.SELECT;
        this.etykieta = etykieta;
        this.element = document.createElement("select");
        this.element.name = nazwa;
        for (var _i = 0, opcje_1 = opcje; _i < opcje_1.length; _i++) {
            var wartosc = opcje_1[_i];
            var optionElement = document.createElement("option");
            optionElement.text = optionElement.value = wartosc;
            this.element.appendChild(optionElement);
        }
        this.opcje = opcje;
        this.element.value = wartoscDomyslna;
    }
    SelectField.prototype.render = function (rodzic) {
        var labelElement = FieldLabel.stworz(this);
        rodzic.appendChild(labelElement);
        rodzic.appendChild(this.element);
    };
    SelectField.prototype.getValue = function () {
        return this.element.value;
    };
    return SelectField;
}());
var CheckboxField = /** @class */ (function () {
    function CheckboxField(nazwa, etykieta, domyslnaWartosc) {
        if (domyslnaWartosc === void 0) { domyslnaWartosc = "false"; }
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
    CheckboxField.prototype.render = function (rodzic) {
        var labelElement = FieldLabel.stworz(this);
        rodzic.appendChild(labelElement);
        rodzic.appendChild(this.element);
    };
    CheckboxField.prototype.getValue = function () {
        return this.element.checked.toString();
    };
    return CheckboxField;
}());
var Form = /** @class */ (function () {
    function Form(pola, idForumlarza, trybEdycji, idDokumentu) {
        if (idForumlarza === void 0) { idForumlarza = ""; }
        if (trybEdycji === void 0) { trybEdycji = false; }
        if (idDokumentu === void 0) { idDokumentu = ""; }
        this.locStorage = new LocStorage();
        this.pola = pola;
        this.trybEdycji = trybEdycji;
        this.idDokumentu = idDokumentu;
        this.idForumlarza = idForumlarza;
    }
    Form.prototype.render = function (rodzic) {
        var _this = this;
        var formularz = document.createElement("form");
        for (var _i = 0, _a = this.pola; _i < _a.length; _i++) {
            var pole = _a[_i];
            pole.render(formularz);
        }
        var przyciskWstecz = document.createElement("button");
        przyciskWstecz.type = "button";
        przyciskWstecz.innerHTML = "Wstecz";
        przyciskWstecz.addEventListener("click", function (e) {
            window.location.href = "/index.html";
        });
        formularz.appendChild(przyciskWstecz);
        var przyciskZapisu = document.createElement("button");
        przyciskZapisu.type = "submit";
        przyciskZapisu.innerHTML = "Wyślij";
        przyciskZapisu.addEventListener("click", function (e) {
            _this.save();
            window.location.href = "/document-list.html";
            e.preventDefault();
        });
        formularz.appendChild(przyciskZapisu);
        rodzic.appendChild(formularz);
    };
    Form.prototype.getValue = function () {
        var wartosci = [];
        for (var _i = 0, _a = this.pola; _i < _a.length; _i++) {
            var pole = _a[_i];
            wartosci.push({
                nazwa: pole.element.name,
                etykieta: pole.etykieta,
                typ: pole.typ,
                opcje: pole.opcje,
                domyslnaWartosc: pole.getValue()
            });
        }
        return wartosci;
    };
    Form.prototype.save = function () {
        if (this.trybEdycji) {
            this.locStorage.saveDocument(this.getValue(), this.idDokumentu);
        }
        else {
            this.locStorage.saveDocument(this.getValue());
        }
    };
    return Form;
}());
var LocStorage = /** @class */ (function () {
    function LocStorage() {
    }
    LocStorage.prototype.saveDocument = function (wartosci, id) {
        if (id === void 0) { id = ""; }
        if (id === "") {
            id = "document-" + Date.now();
        }
        var listaDokumentow = localStorage.getItem("documentList");
        var dokumenty = [];
        if (listaDokumentow !== null) {
            dokumenty = JSON.parse(listaDokumentow);
        }
        if (dokumenty.indexOf(id) === -1) {
            dokumenty.push(id);
        }
        localStorage.setItem("documentList", JSON.stringify(dokumenty));
        localStorage.setItem(id, JSON.stringify(wartosci));
        return id;
    };
    LocStorage.prototype.loadDocument = function (id) {
        return JSON.parse(localStorage.getItem(id));
    };
    LocStorage.prototype.getDocuments = function () {
        var listaDokumentow = localStorage.getItem("documentList");
        var dokumenty = [];
        if (listaDokumentow !== null) {
            dokumenty = JSON.parse(listaDokumentow);
        }
        return dokumenty;
    };
    LocStorage.prototype.removeDocument = function (id) {
        var listaDokumentow = localStorage.getItem("documentList");
        var dokumenty = [];
        if (listaDokumentow !== null) {
            dokumenty = JSON.parse(listaDokumentow);
        }
        if (dokumenty.indexOf(id) > -1) {
            dokumenty.splice(dokumenty.indexOf(id), 1);
        }
        localStorage.setItem("documentList", JSON.stringify(dokumenty));
        localStorage.removeItem(id);
    };
    return LocStorage;
}());
var DocumentList = /** @class */ (function () {
    function DocumentList() {
        this.dokumenty = [];
        this.locStorage = new LocStorage();
    }
    DocumentList.prototype.getDocumentList = function () {
        this.dokumenty = this.locStorage.getDocuments();
    };
    DocumentList.prototype.getDocument = function (id) {
        return this.locStorage.loadDocument(id);
    };
    DocumentList.prototype.render = function (rodzic) {
        var _this = this;
        var tabela = document.createElement("table");
        var bodyTabeli = tabela.createTBody();
        var _loop_1 = function (idDokumentu) {
            var dokument = bodyTabeli.insertRow();
            dokument.insertCell().innerHTML = idDokumentu;
            var edycja = document.createElement("a");
            edycja.innerHTML = "Edytuj";
            edycja.href = "edit-document.html?id=" + idDokumentu;
            var usun = document.createElement("a");
            usun.innerHTML = "Usuń";
            usun.href = "#";
            usun.addEventListener("click", function () {
                _this.removeDocument(idDokumentu);
                window.location.reload();
            });
            var przyciski = dokument.insertCell();
            przyciski.appendChild(edycja);
            przyciski.innerHTML += "&nbsp;";
            przyciski.appendChild(usun);
        };
        for (var _i = 0, _a = this.dokumenty; _i < _a.length; _i++) {
            var idDokumentu = _a[_i];
            _loop_1(idDokumentu);
        }
        rodzic.appendChild(tabela);
    };
    DocumentList.prototype.removeDocument = function (id) {
        this.locStorage.removeDocument(id);
    };
    return DocumentList;
}());
var Router = /** @class */ (function () {
    function Router() {
    }
    Router.getParam = function (klucz) {
        var query = window.location.search.substr(1);
        var urlParams = new URLSearchParams(query);
        var param = urlParams.get(klucz);
        return param;
    };
    return Router;
}());
var App = /** @class */ (function () {
    function App() {
    }
    App.prototype.inicjacja = function () {
        var documentList = new DocumentList();
        switch (window.location.pathname) {
            case '/new-document.html':
                var formularz = new Form([
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
                var idDokumentu = Router.getParam("id");
                var dokument = documentList.getDocument(idDokumentu);
                if (dokument !== null) {
                    var pola = [];
                    for (var _i = 0, dokument_1 = dokument; _i < dokument_1.length; _i++) {
                        var fieldInfo = dokument_1[_i];
                        var pole = void 0;
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
                    var form = new Form(pola, "", true, idDokumentu);
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
    };
    return App;
}());
var APP = new App();
APP.inicjacja();
