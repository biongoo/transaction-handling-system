export class ApiError {
  message: string;
  inputName?: string;

  constructor(message: string, inputName?: string) {
    this.message = message;
    this.inputName = inputName;
  }
}
