const express = require("express");
const axios = require("axios");

const app = express();

const port = 8080;

app.get("/team", async (req, res) => {
  return await res.send(
    axios
      .get("https://www.koreabaseball.com/Kbo/League/TeamInfo.aspx")
      .then((res) => {
        return res.data;
      })
  );
});

app.listen(port, () => {
  console.log(`포트 연결 성공: ${port}`);
});
