// const Mongoose = require("mongoose"); Mongoose.Promise = global.Promise;
// const init = async () => {     const dbHost = process.env.DB_HOST;     const
// dbPort = process.env.DB_PORT;     const dbName = process.env.DB_NAME;     try
// {         const db = await
// Mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, {
// useNewUrlParser: true,             useUnifiedTopology: true,
// useCreateIndex: true         });         Logger.info("Connected to
// mongo!!!");         global.Mongoose = db;         global.Schema = db.Schema;
//        return db;     } catch (err) {         console.log(err);
// Logger.error("Could not connect to MongoDB");         return err;     } };
// module.exports = init;

const Sequelize = require("sequelize");

const { env } = process;

const poolConfig = env.NODE_ENV === "production" ? {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
} : {};

const init = async () => {
    try {
        const sequelize = new Sequelize(
            env.DB_NAME || "fliptask",
            env.DB_USER || "root",
            env.DB_PASSWORD || "",
            {
                host: env.DB_HOST || "localhost",
                dialect: "postgres",
                pool: poolConfig,
                logging: Logger.debug.bind(Logger)
            }
        );
        await sequelize.authenticate();
        Print.info("DATABASE CONNECTED");
        Logger.info("[INFO] DATABASE CONNECTED");
        return sequelize;
    } catch (error) {
        Print.error(error);
        throw Error("[ERROR] UNABLE TO CONNECT DATABASE");
    }
};

module.exports = init;
