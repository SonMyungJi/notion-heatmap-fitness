const dotenv = require('dotenv').config()
const { Client } = require('@notionhq/client')

// init client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const database_id = process.env.NOTION_DATABASE_ID

// 수정사항 : 날짜 정보를 Name(text)에서 가져오는 것이 아니라 Date(date)에서 가져올 것
//           그리고 filter가 올해 1월 1일부터 오늘까지가 되도록 설정

async function getSports() {

  // 오늘 날짜와 올해 1월 1일 계산
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0]; // ISO 형식으로 변환 후 날짜 부분만 추출
  const todayFormatted = today.toISOString().split('T')[0]; // ISO 형식으로 변환 후 날짜 부분만 추출

  const { results } = await notion.databases.query({
    database_id: `${database_id}`,
    filter: {
      "and": [
        {
          "property": "Sports",
          "select": {
            "is_not_empty": true
          }
        },
        {
          "property": "Date",
          "date": {
            "on_or_after": startOfYear,
            "on_or_before": todayFormatted
          }
        }
      ]
    }
  })


  const rawData = results.map(page => {
    return {
      "date": new Date(page.properties.Date.date.start),
      "sport": page.properties.Sports.select.name
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
