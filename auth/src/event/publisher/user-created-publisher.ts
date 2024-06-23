import {Publisher, UserCreateEvent} from "@cloud-wave/common";
import {Subjects} from "@cloud-wave/common";

export class UserCreatedPublisher extends Publisher<UserCreateEvent>{
    readonly subject = Subjects.UserCreated;
}