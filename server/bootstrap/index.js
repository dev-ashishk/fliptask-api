const path = require("path");

const env = process.env.NODE_ENV === "production" ? "prod.env" : "dev.env";
require("dotenv").config({
    path: path.resolve(__dirname, `../../env/${env}`)
});

const loadDependency = async (type, dep, moduleObj) => {
    try {
        const res = await require(path.resolve(__dirname, `../${type}/${dep}`));
        global[dep] = typeof (res) === "function" ? await res(moduleObj) : await res;
        moduleObj[dep] = global[dep];
        Print.success(`Dependency [${dep}] loaded from [${type}]`);
        return global[dep];
    } catch (e) {
        Print.error(`Unable to load ${dep}\n`, e);
        throw Error(e);
    }
};
const configuration = {
    base: [
        "Print"
    ],
    services: [
        "MailerService"
    ],
    bootstrap: [
        "Multer",
        "Mailer",
        "Logger",
        "Db",
        "Model",
        "Middleware",
        "Controller",
        "Route",
        "Express"
    ]
};
const loadConfig = async () => {
    const moduleObj = {};
    const typeList = Object.keys(configuration);
    for (let i = 0; i < typeList.length; i++) {
        const type = typeList[i];
        console.log(`[#################################******** Loading ${type} *********#################################]`);
        for (let j = 0; j < configuration[type].length; j++) {
            const name = configuration[type][j];
            // eslint-disable-next-line no-await-in-loop
            await loadDependency(type, name, moduleObj);
        }
    }
};

const loadApp = async () => {
    await loadConfig();
};

module.exports = {
    loadApp,
    loadConfig,
    loadDependency
};
