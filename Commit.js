import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";
import fs from "fs"; // Import file system module

const path = "./data.json";
const readmePath = "./README.md"; // Path to your README file

const startDate = moment("2021-07-01");
const endDate = moment("2021-10-20");

// Function to get a random date between startDate and endDate
const getRandomDate = () => {
  const randomTimestamp = random.int(startDate.valueOf(), endDate.valueOf());
  return moment(randomTimestamp).format();
};

const updateReadme = (totalCommits, totalContributions, currentStreak) => {
  // Read the current README content
  fs.readFile(readmePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading README file:", err);
      return;
    }

    // Replace or add the metrics in the README
    const updatedData = data
      .replace(/Total Commits:\s*\d+/, `Total Commits: ${totalCommits}`)
      .replace(/Total Contributions:\s*\d+/, `Total Contributions: ${totalContributions}`)
      .replace(/Current Streak:\s*\d+\s*days/, `Current Streak: ${currentStreak} days`);

    // Write the updated content back to the README
    fs.writeFile(readmePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error("Error writing to README file:", err);
      } else {
        console.log("README updated successfully!");
      }
    });
  });
};

const markCommit = (commitDate, commitCount) => {
  const data = { date: commitDate };

  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(commitDate, { "--date": commitDate }).push(() => {
      // Update the README after each commit
      updateReadme(commitCount, commitCount * 5, 30); // Example values for contributions and streak
    });
  });
};

const makeCommits = (n) => {
  if (n === 0) return simpleGit().push();

  const commitDate = getRandomDate();
  console.log(commitDate);

  markCommit(commitDate, n);
  
  // Recursively call makeCommits until n reaches 0
  makeCommits(n - 1);
};

// Call makeCommits with the desired number of commits
makeCommits(100);
