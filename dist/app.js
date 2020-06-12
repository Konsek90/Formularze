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
        etykieta.htmlFor = pole.nazwa;
        return etykieta;
    };
    return FieldLabel;
}());
