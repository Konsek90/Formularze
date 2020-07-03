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
    function InputField(nazwa, etykieta, typ) {
        this.etykieta = etykieta;
        this.element = document.createElement("input");
        this.element.name = nazwa;
        this.element.type = this.typ = typ;
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
    function TextAreaField(nazwa, etykieta) {
        this.typ = FieldType.TEXTAREA;
        this.etykieta = etykieta;
        this.element = document.createElement("textarea");
        this.element.name = nazwa;
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
    function SelectField(nazwa, etykieta, wartosci) {
        this.typ = FieldType.TEXTAREA;
        this.etykieta = etykieta;
        this.element = document.createElement("select");
        this.element.name = nazwa;
        for (var _i = 0, wartosci_1 = wartosci; _i < wartosci_1.length; _i++) {
            var wartosc = wartosci_1[_i];
            var optionElement = document.createElement("option");
            optionElement.text = optionElement.value = wartosc;
            this.element.appendChild(optionElement);
        }
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
    function CheckboxField(nazwa, etykieta) {
        this.typ = FieldType.CHECKBOX;
        this.etykieta = etykieta;
        this.element = document.createElement("input");
        this.element.name = nazwa;
        this.element.type = this.typ;
    }
    CheckboxField.prototype.render = function (rodzic) {
        var labelElement = FieldLabel.stworz(this);
        rodzic.appendChild(labelElement);
        rodzic.appendChild(this.element);
    };
    CheckboxField.prototype.getValue = function () {
        return this.element.value;
    };
    return CheckboxField;
}());
var Form = /** @class */ (function () {
    function Form(pola) {
        this.pola = pola;
    }
    Form.prototype.render = function (rodzic) {
        var formularz = document.createElement("form");
        for (var _i = 0, _a = this.pola; _i < _a.length; _i++) {
            var pole = _a[_i];
            pole.render(formularz);
        }
        var przycisk = document.createElement("button");
        przycisk.type = "submit";
        przycisk.innerHTML = "Wyślij";
        przycisk.addEventListener("click", function (e) {
            e.preventDefault();
        });
        formularz.appendChild(przycisk);
        rodzic.appendChild(formularz);
    };
    Form.prototype.getValue = function () {
        var wartosci = {};
        for (var _i = 0, _a = this.pola; _i < _a.length; _i++) {
            var pole = _a[_i];
            wartosci[pole.element.name] = pole.getValue();
        }
        return wartosci;
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
        if (dokumenty.indexOf(id) > -1) {
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
    return LocStorage;
}());
var App = /** @class */ (function () {
    function App() {
    }
    App.prototype.inicjacja = function () {
        var formularz = this.stworzFormularz();
        formularz.render(document.body);
    };
    App.prototype.stworzFormularz = function () {
        return new Form([
            new InputField("imie", "Imię", FieldType.TEXT),
            new InputField("nazwisko", "Nazwisko", FieldType.TEXT),
            new InputField("email", "E-mail", FieldType.EMAIL),
            new SelectField("kierunek", "Wybrany kierunek studiów", ["Informatyka i Ekonometria", "Finanse i Rachunkowość", "Zarządzanie"]),
            new CheckboxField("elearning", "Czy preferujesz e-learning?"),
            new TextAreaField("uwagi", "Uwagi")
        ]);
    };
    return App;
}());
var APP = new App();
APP.inicjacja();
