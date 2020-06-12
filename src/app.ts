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

