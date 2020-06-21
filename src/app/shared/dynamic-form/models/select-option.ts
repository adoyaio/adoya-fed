export class SelectOption {
    value: string | boolean;
    label: string;

    constructor(value: string | boolean, label: string) {
        this.value = value;
        this.label = label;
    }
}
