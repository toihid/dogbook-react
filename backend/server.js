import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Dogs from "./Dogs.js";

import multer from "multer";
import path from "path";

const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cors());

// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure 'uploads/' exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Setup multer for file uploads
app.post("/dogs", upload.single("image"), async (req, res) => {
  try {
    const { name, nick, age, bio, isPresent } = req.body;
    const friends = JSON.parse(req.body.friends || "[]");
    const image = req.file ? req.file.filename : "";

    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .send("Bad Request: 'name' is required and must be a string.");
    }

    // Create new dog
    const newDog = new Dogs({
      name,
      nick,
      age,
      bio,
      isPresent: isPresent === "true",
      friends,
      image,
    });

    await newDog.save();

    // Make the relationship bidirectional
    if (friends.length > 0) {
      await Dogs.updateMany(
        { _id: { $in: friends } },
        { $addToSet: { friends: newDog._id } }
      );
    }

    res.status(200).json(newDog);
  } catch (error) {
    console.error("Error creating new dog:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/dogs/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nick, age, bio, isPresent, friends } = req.body;
    const image = req.file ? req.file.filename : null;

    // Parse friends only if necessary (e.g., if they come as a stringified array)
    const parsedFriends = friends ? JSON.parse(friends) : [];

    const dog = await Dogs.findById(id);
    if (!dog) return res.status(404).send("Dog not found");

    // Remove current dog from previous friends' lists before updating
    await Dogs.updateMany({ friends: id }, { $pull: { friends: id } });

    // Update dog properties
    dog.name = name || dog.name;
    dog.nick = nick || dog.nick;
    dog.age = age || dog.age;
    dog.bio = bio || dog.bio;
    dog.isPresent = isPresent === "true"; // Ensure it's a boolean value
    dog.friends = parsedFriends.length > 0 ? parsedFriends : dog.friends; // Only update friends if passed
    if (image) dog.image = image; // Update image only if a new one is uploaded

    // Save the updated dog
    await dog.save();

    // Add the current dog to new friends' lists
    if (parsedFriends.length > 0) {
      await Dogs.updateMany(
        { _id: { $in: parsedFriends } },
        { $addToSet: { friends: dog._id } } // Add current dog to friends' lists without duplicates
      );
    }

    res.status(200).json(dog);
  } catch (error) {
    console.error("Error updating dog:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/dogs", async (req, res) => {
  const dogs = await Dogs.find({});
  res.json(dogs);
});

app.get("/dogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dog = await Dogs.findById(id).populate("friends", "name image");
    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }
    res.json(dog);
  } catch (error) {
    console.error("Error fetching dog:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/dogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDog = await Dogs.findByIdAndDelete(id);
    if (!deletedDog) {
      return res.status(404).json({ error: "Dog not found." });
    }
    // Remove the deleted dog's ID from friends arrays of other dogs
    await Dogs.updateMany({ friends: id }, { $pull: { friends: id } });

    res.json({
      message: "Dog deleted and relationships cleaned up.",
      dog: deletedDog,
    });
  } catch (error) {
    console.error("Error deleting dog:", error);
    res.status(500).json({ error: "Error deleting dog." });
  }
});

const main = async () => {
  let mongoDbAtlus =
    "mongodb+srv://toihid:mongodb24@cluster0.lp0pl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  let mongoDbLocal = "mongodb://127.0.0.1:27017/dogsDB";

  try {
    mongoose
      .connect(mongoDbAtlus)
      .then(() => {
        console.log("Successfully connected to MongoDB");
      })
      .catch((error) => {
        console.log("Error connecting to MongoDB:", error);
      });

    app.listen(PORT, () => {
      console.log(`🚀 Server started @ http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Exit the process if DB connection fails
  }
};

main();
