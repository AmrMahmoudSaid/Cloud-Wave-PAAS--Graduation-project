import {natsWrapper} from "../../__mocks__/nats-wrapper";
import {PaymentCompletedListener} from "../events/listeners/payment-completed-listener";
import {DatabaseOrderType, DatabasePlans, OrderStatus, PaymentCompletedEvent} from "@cloud-wave/common";

const setup = () => {
    // Create an instance of the listener
    // @ts-ignore
    const listener = new PaymentCompletedListener(natsWrapper.client);

    // Create a fake data event
    const data: {
        userPassword: string;
        databaseOrderType: DatabaseOrderType;
        databaseName: string;
        price: number;
        userName: string;
        userId: string;
        plan: DatabasePlans;
        rootPassword: string;
        expiresAt: Date;
        status: OrderStatus
    } = {
        userId: "testuser",
        status: OrderStatus.AwaitingPayment,
        databaseOrderType: DatabaseOrderType.DatabaseMySQL,
        plan: DatabasePlans.BasicPrice,
        rootPassword: "rootpassword",
        databaseName: "testdb",
        userName: "testuser",
        userPassword: "testpassword",
        expiresAt: new Date(),

        price: 100,
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
};
