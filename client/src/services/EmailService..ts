import {IEmail, IEmailService} from "../../../src/common/IEmailService";

export class EmailService implements IEmailService {
    send(email: IEmail): void {
        $.post("api/v1/email",email, (err,data) => {
            console.log(err,data);
        });
    }
   
}