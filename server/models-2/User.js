module.exports = {
    attributes: {
        first_name: {
            type: "string",
            required: [true, "First name is required"],
            trim: true
        },
        last_name: {
            type: "string",
            required: [true, "Last Name is required"],
            trim: true
        },
        email: {
            index: true,
            type: "string",
            trim: true,
            lowercase: true,
            unique: true,
            required: [true, "Email address is required"],
            validate: [
                "Please fill a valid email address"
            ],
            // eslint-disable-next-line no-useless-escape
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
        },
        password: {
            type: "string",
            required: [true, "Password is required"]
        }
    },
    timestamps: true,
    modelName: "user"
};
