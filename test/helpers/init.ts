import {config} from "dotenv";

config({path: ".env.test"});
import nock from 'nock';
import test from 'ava';

// @ts-ignore
global.nock = nock;
// @ts-ignore
global.test = test;