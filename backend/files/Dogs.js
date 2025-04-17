import mongoose from "mongoose";
import sanitizeHtml from "sanitize-html"; // Import sanitize-html library

// Define allowed tags and attributes for sanitization
const allowedTags = ["b", "i", "em", "strong", "p", "ul", "ol", "li", "a"];
const allowedAttributes = {
  a: ["href"], // Allow 'href' attribute for <a> tags
};

const dogsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nick: {
    type: String,
    required: true,
  },
  isPresent: {
    type: Boolean,
  },
  age: {
    type: Number,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dogs", // References other dog documents
    },
  ],
});

// Pre-save middleware to sanitize the data before saving
dogsSchema.pre("save", function (next) {
  this.name = sanitizeHtml(this.name, {
    allowedTags: [],
    allowedAttributes: {},
  });

  this.nick = sanitizeHtml(this.nick, {
    allowedTags: [],
    allowedAttributes: {},
  });

  this.bio = sanitizeHtml(this.bio, { allowedTags, allowedAttributes });
  this.image = sanitizeHtml(this.image, {
    allowedTags: [],
    allowedAttributes: {},
  });

  next();
});

dogsSchema.pre("remove", async function (next) {
  try {
    // 'this' is the document to be removed
    await this.model("Dogs").updateMany(
      { friends: this._id },
      { $pull: { friends: this._id } }
    );
    next();
  } catch (error) {
    next(error);
  }
});

// Export the Dogs model
export default mongoose.model("Dogs", dogsSchema);
