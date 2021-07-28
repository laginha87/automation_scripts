import "dotenv/config";
import {main} from "./src/main";

try {
    main();
} catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e);
}
