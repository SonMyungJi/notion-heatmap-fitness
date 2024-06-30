const dotenv = require('dotenv').config()
const { Client } = require('@notionhq/client')

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const database_id = process.env.NOTION_DATABASE_ID

async function getTodos() {

  const today = new Date();
  const startDate = new Date(today.getFullYear() - 1, 11, 25).toISOString();

  const { results } = await notion.databases.query({
    database_id: `${database_id}`,
    filter: {
      "property": "Date",
      "date": {
        "on_or_after": startDate
      }
    }
  })

  console.log(results);

  const rawData = results.map(page => {
    return {
      "name": page.properties.Todo.title[0].text.content,
      "date": new Date(page.properties.date),
      "sun": page.properties.SUN.checkbox ? 1 : 0,
      "mon": page.properties.MON.checkbox ? 1 : 0,
      "tue": page.properties.TUE.checkbox ? 1 : 0,
      "wed": page.properties.WED.checkbox ? 1 : 0,
      "thu": page.properties.THU.checkbox ? 1 : 0,
      "fri": page.properties.FRI.checkbox ? 1 : 0,
      "sat": page.properties.SAT.checkbox ? 1 : 0,
    }
  })

  return rawData
}

// async function getTitle() {

//   const response = await notion.databases.retrieve({
//      database_id: `${database_id}`
//    })
//   const title = response.description[0].text.content

//   return title
// }

module.exports = {
  getTodos: getTodos,
  // getTitle: getTitle
}