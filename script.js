// Get the form and input elements
const signupForm = document.getElementById("signup-form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

// Listen for form submission
signupForm.addEventListener("submit", function (e) {
  // Prevent the default form submission
  e.preventDefault();

  // Clear previous error messages
  clearErrors();

  // Validate the form
  let valid = true;

  // Validate username (non-empty)
  if (username.value.trim() === "") {
    showError(username, "Username is required.");
    valid = false;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value.trim())) {
    showError(email, "Please enter a valid email address.");
    valid = false;
  }

  // Validate password (at least 6 characters)
  if (password.value.length < 6) {
    showError(password, "Password must be at least 6 characters long.");
    valid = false;
  }

  // Validate confirm password (must match password)
  if (password.value !== confirmPassword.value) {
    showError(confirmPassword, "Passwords do not match.");
    valid = false;
  }

  // If all validations pass, submit the form
  if (valid) {
    // Normally here you would submit the form data to the server
    alert("Account created successfully!");
    signupForm.reset(); // Reset the form fields after submission
  }
});

// Function to display error messages
function showError(input, message) {
  const errorMessage = document.createElement("p");
  errorMessage.classList.add("error");
  errorMessage.textContent = message;
  input.insertAdjacentElement("afterend", errorMessage);
}

// Function to clear previous error messages
function clearErrors() {
  const errorMessages = document.querySelectorAll(".error");
  errorMessages.forEach((error) => error.remove());
}
// Get form elements
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// Predefined credentials for testing (You can replace these with actual backend validation)
const validUsername = "admin";
const validPassword = "admin123";

// Listen for form submission
loginForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form submission to handle validation

  // Clear previous error messages
  clearErrors();

  // Validate username and password
  let valid = true;
  if (usernameInput.value.trim() === "") {
    showError(usernameInput, "Username is required.");
    valid = false;
  }

  if (passwordInput.value.trim() === "") {
    showError(passwordInput, "Password is required.");
    valid = false;
  }

  // If validation passes, check credentials
  if (valid) {
    if (
      usernameInput.value.trim() === validUsername &&
      passwordInput.value.trim() === validPassword
    ) {
      // Redirect to dashboard if login is successful
      window.location.href = "dashboard.html";
    } else {
      showError(passwordInput, "Invalid username or password.");
    }
  }
});

// Function to show error messages
function showError(input, message) {
  const errorMessage = document.createElement("p");
  errorMessage.classList.add("error");
  errorMessage.textContent = message;
  input.insertAdjacentElement("afterend", errorMessage);
}

// Function to clear error messages
function clearErrors() {
  const errorMessages = document.querySelectorAll(".error");
  errorMessages.forEach((error) => error.remove());
}

// Get DOM elements
const courseForm = document.getElementById("course-form");
const courseList = document.getElementById("course-list");

// Handle form submission
courseForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get input values
  const courseName = document.getElementById("course-name").value;
  const scheduleDate = document.getElementById("schedule-date").value;
  const prerequisites = document.getElementById("prerequisites").value;

  // Validate input
  if (!courseName || !scheduleDate) {
    alert("Please fill out all required fields.");
    return;
  }

  // Create a new course item
  const listItem = document.createElement("li");
  listItem.innerHTML = `
        <span>${courseName}</span>
        <small>Scheduled: ${scheduleDate}</small>
        <small>Prerequisites: ${prerequisites || "None"}</small>
        <button class="button remove-btn">Remove</button>
    `;

  // Add remove functionality
  listItem.querySelector(".remove-btn").addEventListener("click", function () {
    listItem.remove();
  });

  // Append to course list
  courseList.appendChild(listItem);

  // Clear form
  courseForm.reset();
});
// Get DOM elements
const attendanceForm = document.getElementById("attendance-form");
const attendanceReportButton = document.getElementById("view-report");
const attendanceList = document.getElementById("attendance-report-list");

// Faculty marking attendance
attendanceForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const studentName = document.getElementById("student-name").value;
  const attendanceStatus = document.getElementById("attendance-status").value;

  if (!studentName || !attendanceStatus) {
    alert("Please fill out all fields.");
    return;
  }

  const attendanceItem = document.createElement("li");
  attendanceItem.innerHTML = `
        <span>${studentName}</span>
        <span>${attendanceStatus}</span>
    `;

  // Store attendance locally (for simplicity, you can expand this later to a database)
  let attendanceData = JSON.parse(localStorage.getItem("attendanceData")) || [];
  attendanceData.push({ studentName, attendanceStatus });
  localStorage.setItem("attendanceData", JSON.stringify(attendanceData));

  alert(`${studentName}'s attendance has been marked as ${attendanceStatus}.`);

  // Reset the form
  attendanceForm.reset();
});

// Student viewing attendance report
attendanceReportButton.addEventListener("click", function () {
  // Fetch attendance data from localStorage
  const attendanceData =
    JSON.parse(localStorage.getItem("attendanceData")) || [];

  // Clear previous report
  attendanceList.innerHTML = "";

  // Populate the attendance report
  if (attendanceData.length === 0) {
    attendanceList.innerHTML = "<li>No attendance data available.</li>";
  } else {
    attendanceData.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
                <span>${item.studentName}</span>
                <span>${item.attendanceStatus}</span>
            `;
      attendanceList.appendChild(listItem);
    });
  }
});

// Get DOM elements
const bookForm = document.getElementById("book-form");
const bookList = document.getElementById("book-list");
const transactionForm = document.getElementById("transaction-form");
const transactionBookSelect = document.getElementById("transaction-book");

// Initialize book catalog
let books = [];

// Handle adding a new book to the catalog
bookForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const bookTitle = document.getElementById("book-title").value;
  const bookAuthor = document.getElementById("book-author").value;
  const bookAvailability = document.getElementById("book-availability").value;

  // Create new book object
  const book = {
    title: bookTitle,
    author: bookAuthor,
    availability: bookAvailability,
  };

  // Add book to the books array
  books.push(book);

  // Update the book catalog UI
  updateBookCatalog();

  // Reset the form
  bookForm.reset();
});

// Handle issue or return book transactions
transactionForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const selectedBookTitle = transactionBookSelect.value;
  const transactionType = document.getElementById("transaction-type").value;

  // Find the selected book from the catalog
  const book = books.find((b) => b.title === selectedBookTitle);

  if (book) {
    // Handle issue or return based on transaction type
    if (transactionType === "Issue" && book.availability === "Available") {
      book.availability = "Issued";
    } else if (transactionType === "Return" && book.availability === "Issued") {
      book.availability = "Available";
    } else {
      alert(
        `Cannot ${transactionType} the book. It's either already issued or available.`
      );
      return;
    }

    // Update the book catalog UI
    updateBookCatalog();
  }

  // Reset the form
  transactionForm.reset();
});

// Function to update the book catalog and the transaction dropdown
function updateBookCatalog() {
  // Clear current book list
  bookList.innerHTML = "";

  // Update book list UI
  books.forEach((book) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
            <span>${book.title} by ${book.author}</span>
            <span>Status: ${book.availability}</span>
        `;
    bookList.appendChild(listItem);
  });

  // Update transaction dropdown
  transactionBookSelect.innerHTML = "";
  books.forEach((book) => {
    const option = document.createElement("option");
    option.value = book.title;
    option.innerText = `${book.title} by ${book.author}`;
    transactionBookSelect.appendChild(option);
  });
}
// Get DOM elements
const announcementForm = document.getElementById("announcement-form");
const announcementTitle = document.getElementById("announcement-title");
const announcementContent = document.getElementById("announcement-content");
const announcementList = document.getElementById("announcement-list");

// Array to hold announcements
let announcements = [];

// Handle announcement form submission
announcementForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get values from form fields
  const title = announcementTitle.value;
  const content = announcementContent.value;

  // Create a new announcement object
  const newAnnouncement = {
    title: title,
    content: content,
    date: new Date().toLocaleString(),
  };

  // Add the new announcement to the announcements array
  announcements.push(newAnnouncement);

  // Update the UI with the new announcement
  displayAnnouncements();

  // Reset the form fields
  announcementForm.reset();
});

// Function to display announcements on the page
function displayAnnouncements() {
  // Clear the current announcement list
  announcementList.innerHTML = "";

  // Loop through the announcements array and display each one
  announcements.forEach((announcement) => {
    const listItem = document.createElement("li");

    listItem.innerHTML = `
            <h3>${announcement.title}</h3>
            <p>${announcement.content}</p>
            <span class="date">${announcement.date}</span>
        `;

    announcementList.appendChild(listItem);
  });
}
// Get DOM elements
const feedbackForm = document.getElementById("feedback-form");
const facultyNameInput = document.getElementById("faculty-name");
const courseNameInput = document.getElementById("course-name");
const feedbackContentInput = document.getElementById("feedback-content");
const ratingInput = document.getElementById("rating");
const feedbackList = document.getElementById("feedback-list");

// Array to hold feedback data
let feedbacks = [];

// Handle feedback form submission
feedbackForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get values from form fields
  const facultyName = facultyNameInput.value;
  const courseName = courseNameInput.value;
  const feedbackContent = feedbackContentInput.value;
  const rating = ratingInput.value;

  // Validation for rating (1 to 5)
  if (rating < 1 || rating > 5) {
    alert("Please provide a rating between 1 and 5.");
    return;
  }

  // Create a new feedback object
  const newFeedback = {
    facultyName: facultyName,
    courseName: courseName,
    feedbackContent: feedbackContent,
    rating: rating,
    date: new Date().toLocaleString(),
  };

  // Add the new feedback to the feedback array
  feedbacks.push(newFeedback);

  // Update the feedback list UI
  displayFeedbacks();

  // Reset the form fields
  feedbackForm.reset();
});

// Function to display feedback on the page
function displayFeedbacks() {
  // Clear the current feedback list
  feedbackList.innerHTML = "";

  // Loop through the feedback array and display each one
  feedbacks.forEach((feedback) => {
    const listItem = document.createElement("li");

    listItem.innerHTML = `
            <h3>Faculty: ${feedback.facultyName} | Course: ${feedback.courseName}</h3>
            <p>${feedback.feedbackContent}</p>
            <span class="rating">Rating: ${feedback.rating}/5</span>
            <span class="date">${feedback.date}</span>
        `;

    feedbackList.appendChild(listItem);
  });
}
