import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import config from "../../config";
const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    gender: { type: String, enum: ["male", "female", "other"] },
    assigned: { type: Boolean, default: false },
    children: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// encrypting the password
UserSchema.pre("save", async function (next) {
  const user = this;
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

// remove password from returned document
UserSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.passwordChangeHistory;
  },
});

//is password matched checking
UserSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  const result = await bcrypt.compare(plainTextPassword, hashedPassword);
  console.log(result);
  return result;
};

export const User = model("User", UserSchema);
