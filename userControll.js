import { User } from "./userModal.js";

export function getUserByEmail (request) {
    return User.findOne({email:request.body.email});
}

export function getUserById (userId) {
    return User.findById(userId).select("_id username email");
}