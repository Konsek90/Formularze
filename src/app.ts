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
        return this.element.value;
    }
}
