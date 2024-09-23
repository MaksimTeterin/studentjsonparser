const json = require("./ta-22v.json");
const fs = require('fs');
const XLSX = require('xlsx');

//const parsedjson = JSON.parse(json);
const students = json.students;
var filteredStudents = [];
students.forEach((student) => {
  if (student.status == "OPPURSTAATUS_O") {
    filteredStudents.push({
      name: student.fullname,
      absences: student.totalAbsences,
      Total_grades: gradeCounter(student.fullname),
      Negative_grades: negativeGradeCounter(student.fullname),
      Absent_no_reason: student.withoutReasonAbsences,
      Finnal_grades: finalGradeCounter(student.fullname),
      Finnal_negative_grades: negativeFinalGradeCounter(student.fullname),
    });
  }
});


function gradeCounter(studentName) {
  let gradecounter = 0;
  const found = students
    .find((student) => student.fullname == studentName)
    .resultColumns.forEach((resultColumns) => {
      resultColumns.journalResult.results.forEach((result) => {
        if (result.grade.entryType != 'SISSEKANNE_L') {
          gradecounter++;
          /*console.log(
            gradecounter +
              ". " +
              result.journal.nameEt +
              " " +
              result.grade.code.slice(-1)
          );*/
        }
      });
    });
  return gradecounter;
}
function negativeGradeCounter(studentName) {
  let gradecounter = 1;
  let grades = []
  let badGrades = []
  const found = students
    .find((student) => student.fullname == studentName)
    .resultColumns.forEach((resultColumns) => {
      resultColumns.journalResult.results.forEach((result) => {
        if (result.grade.entryType != 'SISSEKANNE_L') {
          grades.push(result.grade.code.slice(-1))
        }
      });
      badGrades = grades.filter((grade) => grade <= 2 || grade == 'X' || grade == 'MA')
    });
  return badGrades.length;
}
function finalGradeCounter(studentName) {
    let finalgrades = 0;
    const found = students
      .find((student) => student.fullname == studentName)
      .resultColumns.forEach((resultColumns) => {
        resultColumns.journalResult.results.forEach((result) => {
          if (result.entryType == 'SISSEKANNE_L') {
            finalgrades++
          }
          finalgrades + 0
        });
      });
    return finalgrades;
  }

  function negativeFinalGradeCounter(studentName) {
    let gradecounter = 1;
    let finalbadgrades = []
    const found = students
      .find((student) => student.fullname == studentName)
      .resultColumns.forEach((resultColumns) => {
        resultColumns.journalResult.results.forEach((result) => {
          if (result.entryType == 'SISSEKANNE_L') {
            finalbadgrades.push(result.grade.code.slice(-1))
          }
        });
        finalbadgrades = finalbadgrades.filter((grade) => grade <= 2 || grade == 'X' || grade == 'MA')
      });
    return finalbadgrades.length;
  }
//console.log(gradeCounter("Maksim Teterin"));
//console.log(students[21].resultColumns[20].journalResult.results[2]);
console.log(filteredStudents);

const worksheet = XLSX.utils.json_to_sheet(filteredStudents);

// Create a new workbook and append the worksheet
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

// Write the workbook to a file
const filePath = 'json_data.xlsx';
XLSX.writeFile(workbook, filePath);

console.log(`File saved as ${filePath}`);
