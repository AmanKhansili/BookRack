import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json"; // Path to your JSON file

// Function to get a random number of unique dates between start and end dates
const getRandomUniqueDates = (startDate, endDate, minUniqueDates, maxUniqueDates) => {
  const dates = [];
  let currentDate = moment(startDate);
  const end = moment(endDate);

  // Generate all dates in the range
  while (currentDate.isSameOrBefore(end)) {
    dates.push(currentDate.format("YYYY-MM-DD"));
    currentDate.add(1, "days");
  }

  // Select a random number of unique dates within the specified limits
  const numberOfUniqueDates = Math.floor(Math.random() * (maxUniqueDates - minUniqueDates + 1)) + minUniqueDates;
  const shuffledDates = dates.sort(() => Math.random() - 0.5);
  
  return shuffledDates.slice(0, numberOfUniqueDates);
};

const makeRandomCommits = (startDate, endDate, totalCommits, minUniqueDates, maxUniqueDates) => {
  const selectedDates = getRandomUniqueDates(startDate, endDate, minUniqueDates, maxUniqueDates);
  const commitsPerDate = {};

  // Randomly assign commits to each selected date
  for (let i = 0; i < totalCommits; i++) {
    const randomDate = selectedDates[Math.floor(Math.random() * selectedDates.length)];
    if (!commitsPerDate[randomDate]) {
      commitsPerDate[randomDate] = 0;
    }
    commitsPerDate[randomDate]++;
  }

  const commitNextDate = (dateList, index) => {
    if (index >= dateList.length) {
      return simpleGit().push(); // Push all commits to the remote repository
    }

    const date = dateList[index];
    const commitCount = commitsPerDate[date];

    const commitPromises = []; // Array to hold commit promises

    for (let i = 0; i < commitCount; i++) {
      const data = { date }; // Each commit will have the same date

      console.log(`Committing on: ${date}`); // Log the date for debugging

      // Write the data to the JSON file and make the commit
      commitPromises.push(
        new Promise((resolve, reject) => {
          jsonfile.writeFile(path, data, (err) => {
            if (err) {
              console.error(`Error writing file: ${err}`);
              return reject(err);
            }
            // Add and commit with the specified date
            simpleGit().add([path]).commit(date, { "--date": date }, resolve); // Resolve the promise after commit
          });
        })
      );
    }

    // Wait for all commits on this date to complete
    Promise.all(commitPromises)
      .then(() => commitNextDate(dateList, index + 1)) // Proceed to next date
      .catch((err) => console.error(`Error committing: ${err}`));
  };

  commitNextDate(Object.keys(commitsPerDate), 0); // Start the commit process
};

// Call the function with the desired date range, total commits, and unique date limits
makeRandomCommits("2021-07-01", "2021-10-20", 50, 5, 20); // Generate random commits
