// Function that creates a single time block for the given hour
function createTimeBlock(hour) {
  const timeBlock = $("<div>")
    .addClass("row time-block")
    .attr("id", "hour-" + hour);
  const userInput = $("<textarea>")
    .addClass("col-8 col-md-10 description")
    .attr("rows", "3");
  const timeLabel = $("<div>")
    .addClass("col-2 col-md-1 hour text-center py-3")
    .text(dayjs().hour(hour).format("ha"));
  const saveButton = $("<button>")
    .addClass("btn saveBtn col-2 col-md-1")
    .attr("aria-label", "save");
  const saveIcon = $("<i>").addClass("fas fa-save").attr("aria-hidden", "true");

  saveButton.append(saveIcon);
  timeBlock.append(timeLabel, userInput, saveButton);

  return timeBlock;
}
// Function that generates time blocks for a range of hours
function generateTimeBlocks(startHour, endHour) {
  for (let hour = startHour; hour <= endHour; hour++) {
    const timeBlock = createTimeBlock(hour);
    $("#time-block-container").append(timeBlock);
  }
}
// Function that shows the "Appointment added to local storage✅"
// message for a specified duration
function showMessage(duration = 5000) {
  $("#message").removeClass("d-none");
  setTimeout(() => {
    $("#message").addClass("d-none");
  }, duration);
}
// Function that determines if a timeblock is current,past, or future
// and listens for a click on the save button
$(function () {
  // Generate time blocks from 6am to 6pm (6 to 18 in 24-hour format)
  generateTimeBlocks(6, 18);

  $("#currentDay").text(dayjs().format("dddd, MMMM D, YYYY"));
  // Loop through each time block and apply the appropriate background color
  // based on whether the block is in the past, present, or future
  $(".time-block").each(function () {
    const blockHour = parseInt($(this).attr("id").split("-")[1]);
    const currentHour = dayjs().hour();

    if (blockHour < currentHour) {
      $(this).addClass("past");
    } else if (blockHour === currentHour) {
      $(this).removeClass("past");
      $(this).addClass("present");
    } else {
      $(this).removeClass("past");
      $(this).addClass("future");
    }
    const updateBlock = localStorage.getItem("hour-" + blockHour);
    if (updateBlock !== null) {
      $(this).find(".description").val(updateBlock);
    }
  });
 // Listen for click on save button
  $(".saveBtn").on("click", function () {
    const parentDiv = $(this).parent();
    const blockHour = parentDiv.attr("id");
    const description = parentDiv.find(".description").val();

    localStorage.setItem(blockHour, description);
    showMessage();
  });
});
