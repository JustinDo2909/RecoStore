const moogoose = require("mongoose");
const requestSchema = new moogoose.Schema({
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  user: {
    type: moogoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});
const Request = moogoose.model("Request", requestSchema);
module.exports = Request;
