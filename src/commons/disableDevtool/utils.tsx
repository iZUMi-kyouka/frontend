import { now } from "lodash";

function createLargeObject() {
  const largeObject: Record<string, string> = {};
  for (let i = 0; i < 500; i++) {
    largeObject[`${i}`] = `${i}`;
  }
  return largeObject;
}

export function createLargeObjectArray() {
  const largeObject = createLargeObject();
  const largeObjectArray = [];

  for (let i = 0; i < 50; i++) {
    largeObjectArray.push(largeObject);
  }

  return largeObjectArray;
}

export function calculateTime(func: Function) {
  const start = now();
  func();
  return now() - start;
}