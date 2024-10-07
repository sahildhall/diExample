import * as express from 'express';
import * as cors from "cors";

export class Middleware {

    public static implementCors(app: express.Application){
        const corsOptions: any = {
            allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "cmo-token", "meonthemic_client"],
            // credentials: true,
            methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
            origin: "*",
            preflightContinue: false
        };
        app.use(cors(corsOptions))
    }
}
