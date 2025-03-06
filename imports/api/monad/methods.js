import { Meteor } from 'meteor/meteor';
import axios from 'axios';

Meteor.methods({
    async 'monad.nfts'(wallet) {
        if (!process?.env?.MONAD_URL) {
            throw new Meteor.Error('.env problem', 'MONAD_URL not provided');
          }

        const base_url = process.env.MONAD_URL;
        const headers = {
            "x-api-key": process.env.MONAD_KEY,
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