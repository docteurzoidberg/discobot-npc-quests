const fs = require('fs');

const databasePath = process.env.DATABASE_PATH || './data/import';
const databaseFile = `${databasePath}/database.json`;

/*
console.log(generateID(0)); // outputs "AA"
console.log(generateID(25)); // outputs "AZ"
console.log(generateID(26)); // outputs "BA"
console.log(generateID(701)); // outputs "ZZ"
console.log(generateID(702)); // outputs "AAA"
console.log(generateID(18278)); // outputs "AZZ"
console.log(generateID(18279)); // outputs "BAA"
*/

function generateID(index) {
  let numChars = 2; // number of characters in ID
  let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // character set for ID
  let id = ""; // initialize ID string
  index+=charset.length;
  while (index >= 0) {
    let digit = index % charset.length; // get current digit
    id = charset[digit] + id; // prepend current character to ID
    index = Math.floor(index / charset.length) - 1; // move to next digit
    numChars++; // increment number of characters in ID
    // check if ID needs to be extended
    if (digit === charset.length - 1) {
    numChars++;
    }
    charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".repeat(numChars); // update character set for longer IDs
  }
  return id;
}

const database = JSON.parse(fs.readFileSync(databaseFile, 'utf8'));

for(const key in database) {
    let index = 0;
    console.log(key);
    const chanDb = database[key];
    const filename = `${databasePath}/${key}.json`;
    /*
    {
  "version": 1,
  "createdBy": "DrZoid",
  "dateCreated": "2023-03-27T01:40:24.440Z",
  "dateUpdated": "2023-03-27T01:40:24.440Z",
  "dateDeleted": null,
  "dateCompleted": null,
  "name": "suite de quetes", 
  "quests": [
    {
      "id": "AAA",
      "createdBy": "DrZoid",
      "dateCreated": "2013-01-01T00:00:00.000Z",
      "dateUpdated": null,
      "dateDeleted": null,
      "dateCompleted": null,
      "title": "Premiere Quete",
      "description": "Une quete de test",
      "give": "",
      "icon": "http://www.example.com/icon.png",
      "players": ["DrZoid"]
    }
  ]
}
*/
    const quests = chanDb.tasks.map(task => {
        const quest = {
            id: generateID(index++), 
            createdBy: "?",
            dateCreated: new Date(),
            dateUpdated: new Date(),
            dateDeleted: task.status === "DELETED" ? new Date() : null,
            dateCompleted: task.dateCompleted,
            title: task.description,
            description:  "",
            status: task.status,
            give: "",
            icon: "",
            players: [task.responsible]
        };
        console.log(quest);
        return quest;
    });

    const newDb = {
        version: 1,
        createdBy: "?",
        dateCreated: new Date(),
        dateUpdated: new Date(),
        dateDeleted: null,
        dateCompleted: null,
        name: "suite de quetes",
        quests: [...quests]
    };

    fs.writeFileSync(filename, JSON.stringify(newDb, null, 2));
}
