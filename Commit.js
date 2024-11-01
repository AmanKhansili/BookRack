import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json"; // Path to your JSON file

const makeRandomCommits = (startDate, endDate, numberOfCommits) => {
  // Generate a list of all possible dates within the range
  let currentDate = moment(startDate);
  const end = moment(endDate);
  const dates = [];

  while (currentDate.isSameOrBefore(end)) {
    dates.push(currentDate.format("YYYY-MM-DD"));
    currentDate.add(1, "days");
  }

  // Shuffle the dates array to pick random starting dates
  const randomStartIndex = Math.floor(Math.random() * (dates.length - numberOfCommits + 1));
  const selectedDates = dates.slice(randomStartIndex, randomStartIndex + numberOfCommits);

  const commitNextDate = (index) => {
    // If we have processed all selected dates, stop
    if (index >= selectedDates.length) {
      return simpleGit().push(); // Push all commits to the remote repository
    }

    const date = selectedDates[index];
    const data = { date };

    console.log(`Committing on: ${date}`); // Log the date for debugging

    // Write the data to the JSON file and make the commit
    jsonfile.writeFile(path, data, (err) => {
      if (err) {
        console.error(`Error writing file: ${err}`);
        return;
      }
      // Add and commit with the specified date
      simpleGit()
        .add([path])
        .commit(date, { "--date": date }, () => commitNextDate(index + 1)); // Recursively commit next date
    });
  };

  commitNextDate(0); // Start the commit process
};

// Call the function with the desired date range and number of commits
makeRandomCommits("2021-07-01", "2021-09-10", 200); // Example: 10 consecutive commits between October 6 and October 24
