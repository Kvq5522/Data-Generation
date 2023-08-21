const { fakerVI: faker, de } = require("@faker-js/faker");
const fs = require("fs");

//Generate data for department table
const departmentData = [];
let departmentId = 10000;

for (let i = 0; i < 20; i++) {
  let mockData = {
    id: departmentId,
    name: faker.commerce.department(),
    unit_id: faker.string.uuid(),
    description: faker.lorem.paragraph(2),
    lft: faker.number.int(100, 0), //max - min
    rgt: faker.number.int(100, 0),
    level: faker.number.int(10, 1),
  };

  //check duplicate name if exist then generate new name with loop
  while (departmentData.find((item) => item.name === mockData.name)) {
    mockData.name = faker.commerce.department();
  }

  departmentId++;

  departmentData.push(mockData);
}

//write data to sql file

const useDb = `USE orangehrm_mysql;\n\n`;

const departmentPreStatement = `INSERT INTO ohrm_subunit (id, name, unit_id, description, lft, rgt, level) VALUES `;

//Map data to SQL statement
const departmentQuery = departmentData.map((item) => {
  return (
    departmentPreStatement +
    `('${item.id}','${item.name}', '${item.unit_id}', '${item.description}', ${item.lft}, ${item.rgt}, ${item.level});`
  );
});

//Write data to file
fs.writeFileSync(
  "generateDepartment.sql",
  useDb + departmentQuery.join("\n\n"),
  "utf-8"
);

console.log("Generate department data successfully!");

//Generate data for employee table
let employeeNumber = 10000;

const employeePreStatement = `INSERT INTO hs_hr_employee (emp_number, employee_id, emp_lastname, emp_firstname, work_station) VALUES `;

let employeeData = [];

for (let i = 0; i < departmentData.length; i++) {
  for (let j = 0; j < 100; j++) {
    const mockData = {
      emp_number: employeeNumber + j,
      employee_id: employeeNumber + j,
      emp_lastname: faker.person.lastName(),
      emp_firstname: faker.person.firstName(),
      work_station: departmentData[i].id,
    };

    employeeData.push(mockData);
  }

  employeeNumber += 100;
}

const employeeQuery = employeeData.map((item) => {
  return (
    employeePreStatement +
    `('${item.emp_number}','${item.employee_id}', '${item.emp_lastname}', '${item.emp_firstname}', ${item.work_station});`
  );
});

fs.writeFileSync(
  "generateEmployee.sql",
  useDb + employeeQuery.join("\n\n"),
  "utf-8"
);

console.log("Generate employee data successfully!");
