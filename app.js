const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const port = 8080;

const corsoptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsoptions));
// app.use(express.json());

function parseTeamData(data) {
  const result = {};
  let currentTeam = null;
  let i = 0;

  while (i < data.length) {
    const item = data[i].trim();

    // 빈 문자열은 건너뜀
    if (item === "") {
      i++;
      continue;
    }

    // 새로운 구단 이름이 나타나면 구단 객체 생성
    if (
      !result[item] &&
      !item.includes("구단정보") &&
      !item.includes("구단사무실")
    ) {
      currentTeam = item;
      result[currentTeam] = {};
      i++;
      continue;
    }

    // 구단 정보 키-값 쌍 저장
    if (currentTeam && i + 1 < data.length && data[i + 1].trim() !== "") {
      const key = item;
      const value = data[i + 1].trim();
      result[currentTeam][key] = value;
      i += 2;
    } else {
      i++;
    }
  }

  return result;
}
app.get("/teams", async (req, res) => {
  const result = await axios
    .get("https://www.koreabaseball.com/Kbo/League/TeamInfo.aspx")
    .then((res) => {
      const $ = cheerio.load(res.data);

      const result = [];
      for (let i = 1; i <= 10; i++) {
        const value = $(
          `#contents > div.sub-content > div > table > tbody > tr:nth-child(${i})`
        )
          .text()
          .replace(/[\t]/g, "")
          .split("\n");

        result.push(value.filter((i) => !!i));
      }
      //   const result = $("#contents > div.sub-content > div > table > tbody > tr:nth-child(10)")
      //     .text()
      //     .replace(/[\t]/g, "")
      //     .split("\n");

      //   const teams = parseTeamData(result);

      return result;
    });

  res.send(result);
});

app.listen(port, () => {
  console.log(`포트 연결 성공: ${port}`);
});
