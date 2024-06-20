import {Publisher, UserCreateEvent, Subjects} from "@cloud-wave/common";

export class UserCreatedPublisher extends Publisher<UserCreateEvent>{
    readonly subject = Subjects.UserCreated;
}