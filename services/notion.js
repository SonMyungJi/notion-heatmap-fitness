const dotenv = require('dotenv').config()
const { Client } = require('@notionhq/client')

// init client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const database_id = process.env.NOTION_DATABASE_ID

// 수정사항 : "Sports"의 type을 select에서 checkbox로 변경

async function getSports() {

  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];

  const lastYear = today.getFullYear() - 1;
  const lastYearStart = `${lastYear}-12-25`;
  const lastYearEnd = `${lastYear}-12-31`;

  const { results } = await notion.databases.query({
    database_id: `${database_id}`,
    filter: {
      "and": [
        {
          "property": "Sports",
          "checkbox": {
            "equals": true
          }
        },
        {
          "or": [
            {
              "property": "Date",
              "date": {
                "on_or_after": startOfYear,
              }
            },
            {
              "property": "Date",
              "date": {
                "on_or_after": lastYearStart,
                "on_or_before": lastYearEnd
              }
            }
          ]
          
        }
      ]
    }
  })


  const rawData = results.map(page => {
    const sportValue = page.properties.Sports.checkbox.checked ? "Sports" : false;
    return {
      "date": new Date(page.properties.Date.date.start),
      "sport": sportValue
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