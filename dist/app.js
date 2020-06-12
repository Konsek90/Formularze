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
