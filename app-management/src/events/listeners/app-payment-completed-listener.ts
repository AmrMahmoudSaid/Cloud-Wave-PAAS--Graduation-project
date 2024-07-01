import {
    Listener,
    Subjects,
    ApplicationPaymentCompletedEvent,
    ApplicationPlanConfig,
    hosts, ApplicationDeploymentConfig,
    IngressManager,
    IngressRule
} from "@cloud-wave/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {AppConfig} from "../../models/app-config";
export class AppPaymentCompletedListener extends Listener<ApplicationPaymentCompletedEvent> {
    readonly subject = Subjects.ApplicationPaymentCompleted
    queueGroupName = queueGroupName;
    async onMessage(data: ApplicationPaymentCompletedEvent['data'], msq: Message){
        const dataToSave = AppConfig.build({
            userId: data.userId,
            namespace: "waiting",
            deploymentName: "waiting",
            applicationName: data.applicationName,
            serviceName: "waiting",
            nodePort: "waiting",
            status : "Creating",
            host: "data.path",
            plan: data.plan.toString(),
        });
        await dataToSave.save();
        msq.ack();
    }
}
