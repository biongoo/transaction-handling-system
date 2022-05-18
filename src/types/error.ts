export class ApiError {
    name: string;
    message: string;
    inputName?: string;

    constructor(name: string, message: string, inputName?: string) {
        this.name = name;
        this.message = message;
        this.inputName = inputName;
    }
};