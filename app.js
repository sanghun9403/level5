const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/");

app.listen(PORT, () => {
  console.log(PORT, "포트 번호로 서버가 실행되었습니다.");
});
