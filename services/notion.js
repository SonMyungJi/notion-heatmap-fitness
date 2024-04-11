const dotenv = require('dotenv').config()
const { Client } = require('@notionhq/client')

// init client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const database_id = process.env.NOTION_DATABASE_ID

// 수정사항 : Habit Tracker로 변경
// 1. 요일별로 Checkbox가 있는 상태에서 날짜를 확인할 수 있어야 함. 일요일마다 만들어지는 데이터베이스이기 때문에 해당 날에만 생성일자가 기록됨
// 2. 완료한 서로 다른 Habit들의 수를 세어서 해당 날짜에 적용될 색의 농담을 결정할 수 있어야 함

async function getSports() {

  // 오늘 날짜와 올해 1월 1일 계산
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0]; // ISO 형식으로 변환 후 날짜 부분만 추출

  // 필요한 작년의 데이터
  const lastYear = today.getFullYear() - 1;
  const lastYearStart = `${lastYear}-12-25`;
  const lastYearEnd = `${lastYear}-12-31`;

  const { results } = await notion.databases.query({
    database_id: `${database_id}`,
    filter: {
            "property": "SUN",
            "checkbox": {
              "does_not_equal": true
            }
          }
          // {
          //   "property": "MON",
          //   "checkbox": {
          //     "does_not_equal": true
          //   }
          // },
          // {
          //   "property": "TUE",
          //   "checkbox": {
          //     "does_not_equal": true
          //   }
          // },
          // {
          //   "property": "WED",
          //   "checkbox": {
          //     "does_not_equal": true
          //   }
          // },
          // {
          //   "property": "THR",
          //   "checkbox": {
          //     "does_not_equal": true
          //   }
          // },
          // {
          //   "property": "FRI",
          //   "checkbox": {
          //     "does_not_equal": true
          //   }
          // },
          // {
          //   "property": "SAT",
          //   "checkbox": {
          //     "does_not_equal": true
          //   }
          // },
  });

  const habitData = results.map(page => {
    const createdTime = new Date(page.created_time);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const createdDay = createdTime.getDay();
    const habitValues = [];
    for (let i = 0; i < 7; i++) {
      const dayOfWeek = daysOfWeek[(createdDay + i) % 7];
      const habitValue = page.properties[dayOfWeek].checkbox;
      habitValues.push({ day: dayOfWeek, value: habitValue });
    }
    return { createdTime, habitValues };
  });

  return habitData;
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
