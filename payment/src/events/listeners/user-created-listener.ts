import {Listener, UserCreateEvent} from "@cloud-wave/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Subjects} from "@cloud-wave/common";
import {User} from "../../models/user";

export class UserCreatedListener extends Listener<UserCreateEvent>{
    readonly subject = Subjects.UserCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: UserCreateEvent['data'], msg: Message) {
        const user = User.build({
            email: data.email,
            name: data.name,
            customerId: data.customerId,
            id: data.userId
        });
        await user.save();
        console.log(user);
        console.log(`user: ${user.email} added successfully`);
        msg.ack();
    }

}