import { Meteor } from 'meteor/meteor';
import axios from 'axios';

Meteor.methods({
    async 'monad.nfts'(wallet) {
        const base_url = Meteor.settings.monad.url;
        const headers = {
            "x-api-key": Meteor.settings.monad.key,
            "accept": "application/json"
        }

        const nfts = await axios.get(`${base_url}/v2/monad/account/nfts?address=${wallet}`, { headers })
            .then((response) => {
                console.log("responde ====>", response?.data);
                return response?.data?.result?.data;
            }).catch((error) => {
                console.log("Error ====>", error);
                return error?.response?.data;
            });
            
        return nfts;
    },
});