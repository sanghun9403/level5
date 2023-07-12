const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3000;

const usersRouter = require("./routes/users.route");
const postsRouter = require("./routes/posts.route");
const commentsRouter = require("./routes/comments.route");

app.use(express.json());
app.use(cookieParser());
app.use("/", [usersRouter, postsRouter, commentsRouter]);

app.listen(PORT, () => {
  console.log(PORT, "포트 번호로 서버가 실행되었습니다.");
});
