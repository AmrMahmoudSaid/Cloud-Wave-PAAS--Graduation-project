import {
    Listener,
    Subjects,
    ApplicationPaymentCompletedEvent
} from "@cloud-wave/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {GitFun} from "../../gitFun";
import path from "path";
export class AppPaymentCompletedListener extends Listener<ApplicationPaymentCompletedEvent> {
    readonly subject = Subjects.ApplicationPaymentCompleted
    queueGroupName = queueGroupName;

    async onMessage(data: ApplicationPaymentCompletedEvent['data'], msq: Message){
        try {
            const gitFun = new GitFun();
            const path1 =  path.join(__dirname, 'repository');
            console.log(path1);
            await gitFun.cloneRepo(data.gitUrl,path1);
            let tag = gitFun.getCurrentVersion(path1);
            if (!tag){
                tag = "latest";
            }
            await gitFun.buildDockerImage(path1,data.applicationName,tag);
            msq.ack();

        }catch(error){
            throw new Error("Some thing want wrong try again later.")
        }
    }
}
