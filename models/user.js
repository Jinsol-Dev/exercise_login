const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  nickname: String,
  password: String,
});
UserSchema.virtual("userId").get(function () {  //가상으로 읽을 수 있는 파라미터 추가
  return this._id.toHexString();
});
UserSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("User", UserSchema);