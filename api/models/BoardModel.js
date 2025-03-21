const moment = require("moment-timezone");

module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      boardName: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      titles: [
        {
          key: String,
          title: { type: String, required: true },
          comments: [
            {
              username: { type: String, required: true },
              message: { type: String, required: true },
              timestamp: { type: Date, default: Date.now },
              replies: [
                {
                  username: { type: String, required: true },
                  message: { type: String, required: true },
                  timestamp: { type: Date, default: Date.now },
                },
              ],
            },
          ],
        },
      ],
      type: {
        type: String,
        required: true,
        enum: ["Standard Board", "Phased Board"],
      },
      defaultboard: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, createdAt, updatedAt, ...object } = this.toObject();
    object.id = _id;

    const userTimezone = object.timezone || "UTC";
    object.createdAt = moment(createdAt).tz(userTimezone).format("YYYY-MM-DD HH:mm:ss");
    object.updatedAt = moment(updatedAt).tz(userTimezone).format("YYYY-MM-DD HH:mm:ss");

    return object;
  });

  const model = mongoose.model("board", schema);
  return model;
};
