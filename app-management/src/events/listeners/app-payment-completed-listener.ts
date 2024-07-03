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
const date = new Date();
const day = date.toLocaleDateString('en-US', { weekday: 'long' });
const month = date.toLocaleDateString('en-US', { month: 'long' });
const year = date.getFullYear();
const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
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
            lastDeployment: `${day}-${month}-${year}:${time}`
        });
        await dataToSave.save();
        msq.ack();
    }
}
