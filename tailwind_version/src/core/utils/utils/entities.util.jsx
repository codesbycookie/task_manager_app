const ENTITIES = [
  "enquiry",
  "feetype",
  "file",
  "student-test",
  "student-attendance",
  "teacher-attendance",
  "student-payment",
  "teacher",
  "board",
  "batch",
  "standard",
  "subject",
  "student",
  "school",
  "test",
];

const ACTIONS = ["view", "create", "update", "delete"];

const buildDefaultPermissions = () => {
  const obj = {};
  ENTITIES.forEach((entity) => {
    obj[entity] = {};
    ACTIONS.forEach((action) => {
      obj[entity][action] = false;
    });
  });
  return obj;
};


// eslint-disable-next-line react-refresh/only-export-components
export { ENTITIES, ACTIONS  , buildDefaultPermissions };