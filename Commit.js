import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

// Set the start and end dates
const startDate = moment("2021-07-01");
const endDate = moment("2021-10-20");

const getRandomDate = () => {
  // Generate a random timestamp between startDate and endDate
  const randomDate = moment(startDate.valueOf() + random.int(0, endDate.diff(startDate))).format();
  return randomDate;
};

const markCommit = (date) => {
  const data = {
    date: date,
  };

  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(date, { "--date": date }).push();
  });
};

const makeCommits = (n) => {
  if (n === 0) return simpleGit().push();

  const date = getRandomDate();
  console.log(date);

  jsonfile.writeFile(path, { date: date }, () => {
    simpleGit()
      .add([path])
      .commit(date, { "--date": date }, makeCommits.bind(this, n - 1));
  });
};

// Start making commits
makeCommits(100);
