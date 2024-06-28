import {Subjects} from "./subjects";
export interface OrderCancelledEvent{
    subject: Subjects.OrderDeleted;
    data: {
        id: string;
        ticket: {
            id: string;
        }
    }
}