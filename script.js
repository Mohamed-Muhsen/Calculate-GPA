
function calculateGPA() {
  var gradeInput = parseFloat(document.getElementById("grade").value);
  var creditInput = parseFloat(document.getElementById("credit").value);
  var gpaScale = parseFloat(document.querySelector('input[name="gpaScale"]:checked').value);

  if (isNaN(gradeInput) || gradeInput < 0 || gradeInput > 100) {
    alert("Please enter a valid grade between 0 and 100.");
    return;
  }
  if (isNaN(creditInput) || creditInput < 0) {
    alert("Please enter a valid number for credit hours.");
    return;
  }

  var table = document.getElementById("courseTable");
  var row = table.insertRow(-1);
  var gradeCell = row.insertCell(0);
  var creditCell = row.insertCell(1);
  var deleteCell = row.insertCell(2);
  gradeCell.innerHTML = gradeInput;
  creditCell.innerHTML = creditInput;
  deleteCell.innerHTML = '<button onclick="deleteCourse(this)"><i class="fas fa-times"></i></button>';

  document.getElementById("grade").value = "";
  document.getElementById("credit").value = "";

  updateTermGPA(gpaScale);
  updateOverallGPA();
}

function updateOverallGPA() {
  var oldGPA = parseFloat(document.getElementById("oldGPA").value);
  var oldCredit = parseFloat(document.getElementById("oldCredit").value);
  var gpaScale = parseFloat(document.querySelector('input[name="gpaScale"]:checked').value);

  var table = document.getElementById("courseTable");
  var totalQualityPoints = 0;
  var totalCredits = oldCredit;

  for (var i = 1; i < table.rows.length; i++) {
    var grade = parseFloat(table.rows[i].cells[0].innerHTML);
    var credit = parseFloat(table.rows[i].cells[1].innerHTML);
    var qualityPoints = calculateQualityPoints(grade) * credit;
    totalQualityPoints += qualityPoints;
    totalCredits += credit;
  }

  var overallGPA;

  if ((isNaN(oldGPA) || oldGPA === 0) || (isNaN(oldCredit) || oldCredit === 0)) {
    // If Old GPA or Old Credit Hours is empty or zero, set Overall GPA to Term GPA
    overallGPA = parseFloat(document.getElementById("termGPA").value);
  } else {
    overallGPA = (oldGPA * oldCredit + totalQualityPoints) / totalCredits;
  }

  var scaledOverallGPA = overallGPA * (gpaScale / 4); // Adjust GPA scale
  document.getElementById("gpa").value = scaledOverallGPA.toFixed(4); // Fix the decimal precision

  // Update Term GPA as well
  updateTermGPA(gpaScale);
}

function updateTermGPA(gpaScale) {
  var table = document.getElementById("courseTable");
  var totalQualityPoints = 0;
  var totalCredits = 0;

  for (var i = 1; i < table.rows.length; i++) {
    var grade = parseFloat(table.rows[i].cells[0].innerHTML);
    var credit = parseFloat(table.rows[i].cells[1].innerHTML);
    var qualityPoints = calculateQualityPoints(grade) * credit;
    totalQualityPoints += qualityPoints;
    totalCredits += credit;
  }

  var termGPA = totalQualityPoints / totalCredits;
  var scaledTermGPA = termGPA * (gpaScale / 4); // Adjust GPA scale
  document.getElementById("termGPA").value = scaledTermGPA.toFixed(4); // Fix the decimal precision
}

function calculateQualityPoints(grade) {
  if (grade >= 90) {
    return 4.0;
  } else if (grade >= 85) {
    return 3.7;
  } else if (grade >= 80) {
    return 3.3;
  } else if (grade >= 75) {
    return 3.0;
  } else if (grade >= 70) {
    return 2.7;
  } else if (grade >= 65) {
    return 2.3;
  } else if (grade >= 60) {
    return 2.0;
  } else {
    return 0; // Fail
  }
}

function deleteCourse(button) {
  var row = button.parentNode.parentNode;
  row.parentNode.removeChild(row);

  // بعد حذف الكورس، قم بتحديث المعدل التراكمي تلقائيًا
  updateTermGPA(parseFloat(document.querySelector('input[name="gpaScale"]:checked').value));
  updateOverallGPA();
}
