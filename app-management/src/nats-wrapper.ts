import nats, {Message, Stan, SubscriptionOptions} from 'node-nats-streaming';

class NatsWrapper {
    private _client?: Stan;

    get client() {
        if (!this._client) {
            throw new Error('Cannot access NATS client before connecting');
        }
        return this._client;
    }

    connect(clusterId: string, clientId: string, url: string) {
        this._client = nats.connect(clusterId, clientId, { url });

        return new Promise<void>((resolve, reject) => {
            this.client.on('connect', () => {
                console.log('Connected to NATS');
                resolve();
            });
            this.client.on('error', (err) => {
                reject(err);
            });
        });
    }

    async publishWithRetry(subject: string, data: any, retryDelayMs: number = 15 * 60 * 1000) {
        const publish = async () => {
            try {
                await this.client.publish(subject, JSON.stringify(data));
                console.log(`Published message to ${subject}`);
            } catch (error) {
                console.error(`Failed to publish message to ${subject}:`, error);
                // Retry after delay
                setTimeout(publish, retryDelayMs);
            }
        };

        await publish();
    }

    subscribe(subject: string, callback: (msg: Message) => void, options?: SubscriptionOptions) {
        this.client.subscribe(subject, options );
    }
}

export const natsWrapper = new NatsWrapper();
