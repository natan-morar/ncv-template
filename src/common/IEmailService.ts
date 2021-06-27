export interface IEmail {
    subject:string;
    body:string;
    plan?:boolean;
    html?:boolean;
    to?:string[];
    cc?:string[];
    bcc?:string[];
    attachments?:string[];
}

export interface IEmailService {
    send(email:IEmail):void;
}