import { IEmail, IEmailService } from "../common/IEmailService";

export class EmailService implements IEmailService {
    public send(email: IEmail): void {
        throw new Error("Method not implemented.");
    }

    
}