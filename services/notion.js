const dotenv = require('dotenv').config()
const { Client } = require('@notionhq/client')

// init client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const database_id = process.env.NOTION_DATABASE_ID

// 수정사항 : 주간 데이터 가져오기

async function getSports() {

  const today = new Date();
  const lastYear = today.getFullYear() - 1;
  const lastYearStart = `${lastYear}-12-25`;

  const { results } = await notion.databases.query({
    database_id: `${database_id}`,
    filter: {
      "timestamp": "created_time",
      "created_time": {
        "on_or_after": lastYearStart
      }
    }
  })


  const rawData = results.map(page => {
    return {
      "title": page.properties.Name.title,
      "date": new Date(page.created_time),
      "sport": page.properties.Sports.select.name,
      "sun": page.properties.SUN.checkbox ? 1 : 0,
      "mon": page.properties.MON.checkbox ? 1 : 0
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
  getSports: getSports,
  getTitle: getTitle
}