import {
  AGE_RANGE,
  DEGREE_PROGRAMS,
  FIRST_NAMES,
  LAST_NAMES,
  MIDDLE_INITIALS,
} from '../constants/profileData';

function pick(list, random) {
  return list[Math.floor(random() * list.length)];
}

function randomInt(min, max, random) {
  return min + Math.floor(random() * (max - min + 1));
}

// Pure profile generator (no React). Pass `excludeFullName` to guarantee the
// result differs from the previous card; `random` can be injected for tests.
export function generateProfile({ excludeFullName = null, random = Math.random } = {}) {
  let firstName;
  let middleInitial;
  let lastName;
  let fullName;

  do {
    firstName = pick(FIRST_NAMES, random);
    middleInitial = pick(MIDDLE_INITIALS, random);
    lastName = pick(LAST_NAMES, random);
    fullName = `${firstName} ${middleInitial}. ${lastName}`;
  } while (fullName === excludeFullName);

  return {
    firstName,
    middleInitial,
    lastName,
    fullName,
    initials: `${firstName[0]}${lastName[0]}`.toUpperCase(),
    education: pick(DEGREE_PROGRAMS, random),
    age: randomInt(AGE_RANGE.min, AGE_RANGE.max, random),
  };
}
