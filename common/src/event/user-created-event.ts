import {Subjects} from "./subjects";
import {OrderStatus} from "../../build";
export interface UserCreateEvent{
    subject: Subjects.UserCreated;

    data: {
        id: string;
        userId: string;
        email: string;
        name: string;
        customerId: string;
    }
}