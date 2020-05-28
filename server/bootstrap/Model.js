const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const attributeMapping = {
    required: "allowNull"
};

function capitalize(string="") {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class ModelBuilder {
    constructor(dir) {
        this.dir = dir;
        this.files = fs.readdirSync(dir);
        this.loadModels = this.loadModels.bind(this);
        this.getModel = this.getModel.bind(this);
        this.loadModels();
    }
    static DataTypes = Sequelize;

    static convertColumnAttributes(attributes) {
        return Object.keys(attributes).reduce((acc, key) => {
            if (key in attributeMapping) {
                acc[attributeMapping[key]] = attributes[key];
            } else if (typeof attributes[key] === "object" && !attributes[key].length) {
                acc[key] = ModelBuilder.convertColumnAttributes(attributes[key]);
            } else {
                acc[key] = attributes[key];
            }
            return acc;
        }, {});
    }

    static convertDataTypes(attributes) {
        return Object.keys(attributes).reduce((acc, key) => {
            const column = attributes[key];
            if (typeof column === "string") {
                acc[key] = ModelBuilder.DataTypes[column.toUpperCase()];
            } else {
                acc[key] = {
                    ...column,
                    type: ModelBuilder.DataTypes[column.type ? column.type.toUpperCase() : "STRING"]
                };
            }
            return acc;
        }, {});
    }

    static sanitizeFields(columnFields) {
        try {
            const updatedAttributes = ModelBuilder.convertColumnAttributes(columnFields);
            return ModelBuilder.convertDataTypes(updatedAttributes);
        } catch (error) {
            throw Error(error);
        }
    }

    async getModel(file) {
        try {
            const modelDef = await require(`${this.dir}/${file}`);
            const { attributes, modelName, ...options } = modelDef;
            const tableName = modelName || file.split(".")[0];
            const sanitizedSchema = ModelBuilder.sanitizeFields(attributes);
            global[capitalize(tableName)] = Db.define(tableName, sanitizedSchema, options);
            return global[capitalize(tableName)];
        } catch (error) {
            throw Error(error);
        }
    }

    async loadModels() {
        const resolvedSchemas = await this.files.reduce(async (acc, file) => {
            try {
                await this.getModel(file);
                Print.info(`Dependency [${file}] loaded from [models]`);
                return acc;
            } catch (e) {
                Print.error(`Unable to load ${file}`);
                throw Error(e);
                return e;
            }
        }, {});
        return resolvedSchemas;
    }
}


module.exports = new ModelBuilder(path.resolve(__dirname, "../models-2"));
