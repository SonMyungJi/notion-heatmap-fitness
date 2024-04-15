const dotenv = require('dotenv').config()
const { Client } = require('@notionhq/client')

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const database_id = process.env.NOTION_DATABASE_ID

async function getTodos() {

  const today = new Date();
  let startYear = today.getFullYear();
  let startMonth = (today.getMonth() - 6).toString().padStart(2, '0'); // 한 달을 더해야 되니까 -6
  let startDate = `${startYear}-${startMonth}-01`;

  // 월이 음수일 경우에는 연도를 조정하고 월을 설정
  if (startMonth < 1) {
    startYear -= 1;
    startMonth = (startMonth + 12).toString().padStart(2, '0');
    startDate = `${startYear}-${startMonth}-01`;
  }

  const { results } = await notion.databases.query({
    database_id: `${database_id}`,
    filter: {
      "timestamp": "created_time",
      "created_time": {
        "on_or_after": startDate
      }
    }
  })

  const rawData = results.map(page => {
    return {
      "name": page.properties.Todo.title[0].text.content,
      "date": new Date(page.created_time),
      "sun": page.properties.SUN.checkbox ? 1 : 0,
      "mon": page.properties.MON.checkbox ? 1 : 0,
      "tue": page.properties.TUE.checkbox ? 1 : 0,
      "wed": page.properties.WED.checkbox ? 1 : 0,
      "thr": page.properties.THU.checkbox ? 1 : 0,
      "fri": page.properties.FRI.checkbox ? 1 : 0,
      "sat": page.properties.SAT.checkbox ? 1 : 0,
    }
  })

  return rawData
}

async function getTitle() {

  const response = await notion.databases.retrieve({
    database_id: `${database_id}`
  })
  const title = response.description[0].text.content

  return title
}

module.exports = {
  getTodos: getTodos,
  getTitle: getTitle
}