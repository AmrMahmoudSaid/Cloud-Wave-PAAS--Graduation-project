import {PaymentCompletedListener} from "../payment-completed-listener";
import {natsWrapper} from "../../../../__mocks__/nats-wrapper";
import {
    DatabaseOrderType,
    DatabasePlanConfig,
    DatabasePlans,
    OrderStatus,
    PaymentCompletedEvent
} from "@cloud-wave/common";
import {Message} from "node-nats-streaming";
import {createMySQLDeploymentAndServiceWithIngress} from "../../../databases-deployment-config/mysql";

// Mock the dependent modules
jest.mock("../../../databases-deployment-config/mysql");
jest.mock("../../../databases-deployment-config/mongo");
jest.mock("../../../databases-deployment-config/postgres");
jest.mock("../../../nats-wrapper")

const setup = () => {
    // @ts-ignore
    const listener = new PaymentCompletedListener(natsWrapper.client);
    const data: PaymentCompletedEvent["data"] = {
        userId: "testuser",
        databaseOrderType: DatabaseOrderType.DatabaseMySQL,
        status: OrderStatus.AwaitingPayment,
        plan: DatabasePlans.Basic,
        rootPassword: "rootpassword",
        databaseName: "testdb",
        userName: "testuser",
        userPassword: "testpassword",
        orderId: "orderTest",
        price: 100,
        expiresAt: new Date(),

    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
};

it("handles the event and acknowledges the message", async () => {
    const { listener, data, msg } = setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it("creates a MySQL deployment and service with ingress when plan is Basic", async () => {
    const { listener, data, msg } = setup();

    await listener.onMessage(data, msg);

    expect(createMySQLDeploymentAndServiceWithIngress).toHaveBeenCalled();
    expect(createMySQLDeploymentAndServiceWithIngress).toHaveBeenCalledWith(expect.objectContaining({
        namespace: "default",
        rootPassword: data.rootPassword,
        databaseName: data.databaseName,
        userName: data.userName,
        userPassword: data.userPassword,
        storageSize: `${DatabasePlanConfig.StorageBasic}Gi`,
        memoryLimit: `${DatabasePlanConfig.RAMBasic}Gi`,
        cpuLimit: DatabasePlanConfig.CPUBasic,
    }));
});
