import { useSetChain } from "@web3-onboard/react";
import React, { useMemo } from "react";
import { Client, createClient, Provider } from "urql";

import configFile from "./config.json";

const config: any = configFile;

const useGraphQL = () => {
    const [{ connectedChain }] = useSetChain();
    return useMemo<Client | null>(() => {
        if (!connectedChain) {
            return null;
        }
        let url = "";

        if(config[connectedChain.id]?.graphqlAPIURL) {
            url = `${config[connectedChain.id].graphqlAPIURL}/graphql`;
        } else {
            console.error(`No GraphQL interface defined for chain ${connectedChain.id}`);
            return null;
        }

        if (!url) {
            return null;
        }

        return createClient({ url });
    }, [connectedChain]);
};

export const GraphQLProvider: any = (props: any) => {
    const client = useGraphQL();
    if (!client) {
        return <div />;
    }
    
    return <Provider value={client}>{props.children}</Provider>;
};

