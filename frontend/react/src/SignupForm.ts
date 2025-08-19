import { Observable } from "./Observable";

export default class SignupForm extends Observable {
    step = 1;
    name = "";
    email = "";
    document = "";
    password = "";
    confirmPassword = "";
    accountId = "";
    error = "";

    constructor () {
        super();
    }

    next () {
        if (this.validate()) {
            this.step++;
        }
    }

    previous () {
        this.step--;
    }

    async confirm () {
        if (this.validate()) {
            const event = {
                name: this.name,
                email: this.email,
                document: this.document,
                password: this.password
            }
            this.notifyAll("confirmed", event);
        }
    }

    validate () {
        this.error = "";
        if (this.step === 1) {
            if (!this.name) {
                this.error = "Invalid name";
                return false;
            }
            if (!this.email) {
                this.error = "Invalid email";
                return false;
            }
            if (!this.document) {
                this.error = "Invalid document";
                return false;
            }
        }
        if (this.step === 2) {
            if (!this.password) {
                this.error = "Invalid password";
                return false;
            }
            if (!this.confirmPassword) {
                this.error = "Invalid confirm password";
                return false;
            }
            if (this.password !== this.confirmPassword) {
                this.error = "Password and confirm password must match";
                return false;
            }
        }
        return true;
    }

    getProgress () {
        let progress = 0;
        if (this.name) {
            progress += 25;
        }
        if (this.email) {
            progress += 25;
        }
        if (this.document) {
            progress += 25;
        }
        if (
            this.password && 
            this.confirmPassword && 
            this.password === this.confirmPassword
        ) {
            progress += 25;
        }
        return progress;
    }
    
    fill () {
        this.name = "John Doe";
        this.email = "john.doe@gmail.com";
        this.document = "97456321558";
        this.password = "asdQWE123";
        this.confirmPassword = "asdQWE123";
    }

}
