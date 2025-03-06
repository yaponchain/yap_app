// Server entry point, imports all server code
import * as dotenv from 'dotenv';

import '/imports/startup/server';
import '/imports/startup/both';


dotenv.config({path: process.env.PWD + '/.env'});

console.log('############ .ENV CONTENT:', process.env);  