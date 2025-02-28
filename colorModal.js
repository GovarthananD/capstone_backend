import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    link:{type: String, required: true},
    dresstype:{type: String, required: true},
});

const Color = mongoose.model("Color", colorSchema);

export {Color};
