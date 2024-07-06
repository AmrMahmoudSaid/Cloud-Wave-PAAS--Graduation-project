import {Listener, UserCreateEvent} from "@cloud-wave/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queu-group-name";
import {Emails} from "../../emails";
import {Subjects} from "@cloud-wave/common";

export class UserCreatedListener extends Listener<UserCreateEvent>{
    readonly subject = Subjects.UserCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: UserCreateEvent['data'], msg: Message) {
        try {

            if (!data.email){
                data.email = "amrmahmoud1900@gmail.com"
            }
            await new Emails(data.email,data.name).sendWelcome();
            msg.ack();
        }catch (err){
            msg.ack()
            throw err;
        }
    }

}