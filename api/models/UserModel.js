module.exports = mongoose => {
  let schema = mongoose.Schema(
    {
      name: { 
            type: String,
        required: true, 
        unique: true 
      },
      email: { 
        type: String,
        required: true, 
        unique: true 
      },
      password: { 
        type: String, 
      },
      role:{
        type:String
      },
    
      team_ids: [{
        teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
        roles: { type: String, default: 'User' } 
      }]
     
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const model = mongoose.model("users", schema);
  return model;
};
