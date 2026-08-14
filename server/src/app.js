const express = require("express");
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const userRoutes = require("./routes/user.routes");
const imagekitRoutes = require("./routes/imagekit.routes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/imagekit", imagekitRoutes);

//for server check
app.get("/", (req, res) => {  
    res.json({
        message: "DevCollab Backend Running"
    });
});

module.exports = app;