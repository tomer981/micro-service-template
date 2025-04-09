import jetEnv, {bool, num, str} from 'jet-env';
import {isEnumVal} from 'jet-validators';
import {transform} from 'jet-validators/utils';
import {NodeEnvs} from "@src/common/constants";


const ENV = jetEnv({
    NodeEnv: isEnumVal(NodeEnvs),
    Port: num,
    Host: str,
    DisableHelmet: transform((value) => value === 'TRUE', bool),
    JetLoggerMode: str,
    JetLoggerFilepath: str,
    JetLoggerTimestamp: transform((value) => value === 'TRUE', bool),
    JetLoggerFormat: str,
    MongoUri: str,
    MongoInitdbRootUsername: str,
    MongoInitdbRootPassword: str,
    RabbitmqUri: str,
    RabbitmqQueueLogs: str,
});

export default ENV;
