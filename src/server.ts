'use strict';

import * as Hapi from "@hapi/hapi";
import {index} from "./routes";

export let server: Hapi.Server;

export const init = async function (): Promise<Hapi.Server> {
    server = Hapi.server({
        port: process.env.PORT || 4000,
        host: '0.0.0.0'
    });

    // Routes will go here
    server.route({
        method: "GET",
        path: "/hello",
        handler: index
    });

    return server;
};

export const start = async function (): Promise<void> {
    try {
        await server.start();
        console.log("Server running at:", server.info.uri);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

process.on('unhandledRejection', (err) => {
    console.error("unhandledRejection");
    console.error(err);
    process.exit(1);
});
