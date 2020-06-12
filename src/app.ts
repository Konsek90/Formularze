enum FieldType {
    TEXT = "TEXT",
    TEXTAREA = "TEXTAREA",
    DATE = "DATE",
    EMAIL = "EMAIL",
    SELECT = "SELECT",
    CHECKBOX = "CHECKBOX"
}

interface Field {
    nazwa: string,
    etykieta: string,
    typ: FieldType,
    render(rodzic: HTMLElement): void,
    getValue(): string;
}

class FieldLabel {
    static stworz(pole: Field): HTMLLabelElement {
        let etykieta = document.createElement("label");
        etykieta.innerHTML = pole.etykieta;
        etykieta.htmlFor = pole.nazwa;
        return etykieta;
    }
}
