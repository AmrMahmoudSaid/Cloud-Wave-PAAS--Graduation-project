import {Listener, Subjects, UserCreateEvent} from "@cloud-wave/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queu-group-name";
import {Emails} from "../../emails";

export class UserCreatedListener extends Listener<UserCreateEvent>{
    readonly subject = Subjects.UserCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: UserCreateEvent['data'], msg: Message) {
        await new Emails(data.email,data.name).sendWelcome();
        msg.ack();
    }

}