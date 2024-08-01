async function main() {
  const availability_start = 11; // 8am
  const availability_end = 18; // 6pm
  const timezone = "America/Santiago";

  const groupTime = new Date().toLocaleString("en-US", {
    timeZone: timezone,
  });

  const currentHour = new Date(groupTime).getHours();

  console.log({
    currentHour,
    availability_start,
    availability_end,
  });

  if (currentHour < availability_start || currentHour >= availability_end) {
    // compute how many seconds until the next availability time
    let remainingHour;
    if (currentHour < availability_start) {
      remainingHour = availability_start - currentHour;
    } else {
      remainingHour = 24 - currentHour + availability_start;
    }
    const remainingSeconds = remainingHour * 60 * 60;
    console.log(
      "Outside availability time. Remaining seconds: ",
      remainingSeconds + " (in hours: " + remainingHour + ")",
    );
  } else {
    console.log("Inside availability time");
  }
}

main();
