import { object } from "yup";

export const studentFormSchema = object().shape({
  // anticipatedSize: number()
  //   .typeError("global max must be a number")
  //   .integer()
  //   .min(0)
  //   .transform(emptyStringToNull)
  //   .nullable(),
  // day10Used: number()
  //   .typeError("day 10 used must be a number")
  //   .integer()
  //   .min(0)
  //   .transform(emptyStringToNull)
  //   .nullable(),
  // days: array().transform(removeUncheckedValues),
  // department: string().nullable(),
  // duration: number()
  //   .typeError("duration must be a number")
  //   .integer()
  //   .min(0)
  //   .transform(emptyStringToNull)
  //   .nullable(),
  // facultyHours: number()
  //   .required()
  //   .typeError("faculty hours must be a number")
  //   .min(0)
  //   .test("is-decimal", "invalid decimal", decimalRegex),
  // globalMax: number()
  //   .typeError("global max must be a number")
  //   .integer()
  //   .min(0)
  //   .transform(emptyStringToNull)
  //   .nullable(),
  // instructionalMethod: string().nullable(),
  // instructor: array().of(string()).required(),
  // localMax: number()
  //   .typeError("global max must be a number")
  //   .integer()
  //   .min(0)
  //   .transform(emptyStringToNull)
  //   .nullable(),
  // location: string().nullable(),
  // name: string().nullable(),
  // number: string().required().typeError("number is a required field"),
  // prefix: array().of(string().uppercase()).required().typeError("prefix is a required field"),
  // roomCapacity: number()
  //   .typeError("room capacity must be a number")
  //   .positive()
  //   .integer()
  //   .min(0)
  //   .transform(emptyStringToNull)
  //   .nullable(),
  // section: string().required().uppercase().typeError("section is a required field"),
  // status: string().nullable(),
  // studentHours: number()
  //   .required()
  //   .typeError("student hours must be a number")
  //   .min(0)
  //   .test("is-decimal", "invalid decimal", decimalRegex),
  // used: number()
  //   .typeError("used must be a number")
  //   .integer()
  //   .min(0)
  //   .transform(emptyStringToNull)
  //   .nullable(),
  // year: number()
  //   .typeError("year must be a number")
  //   .positive()
  //   .integer()
  //   .min(1970)
  //   .transform(emptyStringToNull)
  //   .nullable(),
});
