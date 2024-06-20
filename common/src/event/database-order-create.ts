import {Subjects} from "./subjects";
import {DatabaseOrderType} from "./enums/database-order-types";
import {DatabasePlans} from "./enums/database-plans";
import {OrderStatus} from "./enums/order-status";
export interface DatabaseOrderCreate {
    subject: Subjects.DatabaseOrderCreate;

    data: {
        userId: string;
        status: OrderStatus;
        expiresAt: Date;
        databaseOrderType: DatabaseOrderType;
        price: number;
        plan: DatabasePlans
    }
}