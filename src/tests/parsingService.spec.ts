import { cloneDeep, first, forEach, get } from "lodash";
import {
  AcademicRecord,
  CovidStatus,
  DroppedOutReason,
  emptyStudent,
  FinalResult,
  Nationality,
  Status,
  Student,
} from "../interfaces";
import {
  expand,
  generateKeys,
  parseAcademicRecordAttendance,
  parseAcademicRecordAudit,
  parseAcademicRecordExitSpeakingExam,
  parseAcademicRecordExitWritingExam,
  parseAcademicRecordFinalGrade,
  parseAcademicRecordLevel,
  parseAcademicRecordResult,
  parseAcademicRecordSession,
  parseAcademicRecordTeacherComments,
  parseAge,
  parseArabicLiteracy,
  parseArabicName,
  parseAudit,
  parseCertRequests,
  parseClassScheduleSentDate,
  parseCorrespondence,
  parseCovidDate,
  parseCovidReason,
  parseCovidStatus,
  parseCovidSuspectedFraud,
  parseCovidSuspectedFraudReason,
  parseCurrentLevel,
  parseCurrentStatus,
  parseDropoutReason,
  parseEnglishLiteracy,
  parseEnglishName,
  parseEnglishTeacher,
  parseEnglishTeacherLocation,
  parseFamilyCoordinator,
  parseFgrDate,
  parseGender,
  parseID,
  parseInitialSession,
  parseInviteTag,
  parseLevelReevalDate,
  parseLiteracyTutor,
  parseLookingForJob,
  parseNationality,
  parseNCL,
  parseNoAnswerClassSchedule,
  parseOccupation,
  parseOrigPlacementAdjustment,
  parseOrigPlacementLevel,
  parseOrigPlacementSpeaking,
  parseOrigPlacementWriting,
  parsePendingPlacement,
  parsePhone,
  parsePhotoContact,
  parseReactivatedDate,
  parseSectionsOffered,
  parseTeacher,
  parseTeachingSubjectAreas,
  parseWABroadcasts,
  parseWABroadcastSAR,
  parseWaPrimPhone,
  parseWithdrawDate,
  parseZoomTutor,
  ValidFields,
} from "../services";

let student: Student;
beforeEach(() => {
  student = cloneDeep(emptyStudent);
});

interface TestFnParams {
  fieldPath: string;
  parseFn: (key: string, value: string, student: Student) => void;
  testName: string;
}

const requiredBooleanTests = ({ fieldPath, parseFn, testName }: TestFnParams) => {
  describe(testName, () => {
    it("parses true", () => {
      parseFn("", "1", student);
      expect(get(student, fieldPath)).toEqual(true);
    });
    it("parses false", () => {
      parseFn("", "", student);
      expect(get(student, fieldPath)).toEqual(false);
    });
  });
};

const optionalBooleanTests = ({ fieldPath, parseFn, testName }: TestFnParams) => {
  describe(testName, () => {
    it("parses true", () => {
      parseFn("", "1", student);
      expect(get(student, fieldPath)).toEqual(true);
    });
    it("parses false as undefined", () => {
      parseFn("", "", student);
      expect(get(student, fieldPath)).toBeUndefined();
    });
  });
};

const dateTests = ({ fieldPath, parseFn, testName }: TestFnParams) => {
  describe(testName, () => {
    it("parses l date", () => {
      parseFn("", "4/3/2021", student);
      expect(get(student, fieldPath)).toEqual("4/3/2021");
    });
    it("parses L date", () => {
      parseFn("", "04/03/2021", student);
      expect(get(student, fieldPath)).toEqual("4/3/2021");
    });
    it("parses MM/DD/YY date", () => {
      parseFn("", "04/03/21", student);
      expect(get(student, fieldPath)).toEqual("4/3/2021");
    });
    it("parses M/D/YY date", () => {
      parseFn("", "4/3/21", student);
      expect(get(student, fieldPath)).toEqual("4/3/2021");
    });
    it("parses last date of multiple", () => {
      parseFn("", "4/3/2021; 5/9/21", student);
      expect(get(student, fieldPath)).toEqual("5/9/2021");
    });
    it("gets date from non-date", () => {
      parseFn("", "NA 1/24/21", student);
      expect(get(student, fieldPath)).toEqual("1/24/2021");
    });
    it("doesn't parse empty string", () => {
      parseFn("", "", student);
      expect(get(student, fieldPath)).toBeUndefined();
    });
  });
};

const multipleDatesTests = ({ fieldPath, parseFn, testName }: TestFnParams) => {
  describe(testName, () => {
    it("parses l date", () => {
      parseFn("", "4/3/2021", student);
      expect(get(student, fieldPath)).toEqual(["4/3/2021"]);
    });
    it("parses L date", () => {
      parseFn("", "04/03/2021", student);
      expect(get(student, fieldPath)).toEqual(["4/3/2021"]);
    });
    it("parses MM/DD/YY date", () => {
      parseFn("", "04/03/21", student);
      expect(get(student, fieldPath)).toEqual(["4/3/2021"]);
    });
    it("parses M/D/YY date", () => {
      parseFn("", "4/3/21", student);
      expect(get(student, fieldPath)).toEqual(["4/3/2021"]);
    });
    it("parses two dates", () => {
      parseFn("", "4/3/2021; 5/9/21", student);
      expect(get(student, fieldPath)).toEqual(["4/3/2021", "5/9/2021"]);
    });
    it("parses three dates", () => {
      parseFn("", "4/3/2021; 5/9/21; 06/10/2021", student);
      expect(get(student, fieldPath)).toEqual(["4/3/2021", "5/9/2021", "6/10/2021"]);
    });
    it("parses separated by &", () => {
      parseFn("", "4/3/2021 & 5/9/21", student);
      expect(get(student, fieldPath)).toEqual(["4/3/2021", "5/9/2021"]);
    });
    it("parses separated by ,", () => {
      parseFn("", "4/3/2021, 5/9/21", student);
      expect(get(student, fieldPath)).toEqual(["4/3/2021", "5/9/2021"]);
    });
    it("gets date from non-date", () => {
      parseFn("", "NA 1/24/21", student);
      expect(get(student, fieldPath)).toEqual(["1/24/2021"]);
    });
    it("doesn't parse empty string", () => {
      parseFn("", "", student);
      expect(get(student, fieldPath)).toBeUndefined();
    });
  });
};
const stringOrNumTests = ({
  fieldPath,
  parseFn,
  testName,
  testVal,
  isNum,
  defaultVal,
}: TestFnParams & { defaultVal?: string; isNum?: boolean; testVal: string }) => {
  describe(testName, () => {
    const undefinedDefaultValTest = (value: string) => {
      parseFn("", value, student);
      const defaultValNum = Number(defaultVal);
      defaultVal !== undefined
        ? expect(get(student, fieldPath)).toEqual(
            !Number.isNaN(defaultValNum) && isNum ? defaultValNum : defaultVal,
          )
        : expect(get(student, fieldPath)).toBeUndefined();
    };
    it("parses value", () => {
      parseFn("", testVal, student);
      isNum
        ? expect(get(student, fieldPath)).toEqual(Number(testVal))
        : expect(get(student, fieldPath)).toEqual(testVal);
    });
    it("parses empty string as undefined/default value", () => {
      undefinedDefaultValTest("");
    });
    isNum &&
      it("parses NaN as undefined/default value", () => {
        undefinedDefaultValTest("NaN");
      });
  });
};

requiredBooleanTests({ fieldPath: "status.inviteTag", parseFn: parseInviteTag, testName: "parses invite tag" });
requiredBooleanTests({ fieldPath: "status.noContactList", parseFn: parseNCL, testName: "parses no contact list" });

optionalBooleanTests({
  fieldPath: "placement.pending",
  parseFn: parsePendingPlacement,
  testName: "parses pending placement",
});
optionalBooleanTests({ fieldPath: "work.isTeacher", parseFn: parseTeacher, testName: "parses is teacher" });
optionalBooleanTests({
  fieldPath: "work.isEnglishTeacher",
  parseFn: parseEnglishTeacher,
  testName: "parses is english teacher",
});
optionalBooleanTests({
  fieldPath: "literacy.illiterateAr",
  parseFn: parseArabicLiteracy,
  testName: "parses arabic literacy",
});
optionalBooleanTests({
  fieldPath: "literacy.illiterateEng",
  parseFn: parseEnglishLiteracy,
  testName: "parses english literacy",
});
optionalBooleanTests({
  fieldPath: "covidVaccine.suspectedFraud",
  parseFn: parseCovidSuspectedFraud,
  testName: "parses covidVaccine suspected fraud",
});
optionalBooleanTests({
  fieldPath: "placement.noAnswerClassScheduleWPM",
  parseFn: parseNoAnswerClassSchedule,
  testName: "parses no answer class schedule",
});

dateTests({ fieldPath: "status.finalGradeSentDate", parseFn: parseFgrDate, testName: "parses FGR date" });
dateTests({
  fieldPath: "status.levelReevalDate",
  parseFn: parseLevelReevalDate,
  testName: "parses level reeval date",
});
multipleDatesTests({
  fieldPath: "status.reactivatedDate",
  parseFn: parseReactivatedDate,
  testName: "parses reactivated date",
});
multipleDatesTests({
  fieldPath: "status.withdrawDate",
  parseFn: parseWithdrawDate,
  testName: "parses withdraw date",
});
multipleDatesTests({
  fieldPath: "placement.classScheduleSentDate",
  parseFn: parseClassScheduleSentDate,
  testName: "parses class schedule sent date",
});
dateTests({
  fieldPath: "covidVaccine.date",
  parseFn: parseCovidDate,
  testName: "parses covidVaccine date",
});

stringOrNumTests({
  defaultVal: emptyStudent.name.english,
  fieldPath: "name.english",
  parseFn: parseEnglishName,
  testName: "parses english name",
  testVal: "Jon Ellis",
});
stringOrNumTests({
  defaultVal: emptyStudent.name.arabic,
  fieldPath: "name.arabic",
  parseFn: parseArabicName,
  testName: "parses arabic name",
  testVal: "جون إليس",
});
stringOrNumTests({
  defaultVal: emptyStudent.epId.toString(),
  fieldPath: "epId",
  isNum: true,
  parseFn: parseID,
  testName: "parses id",
  testVal: "12345",
});
stringOrNumTests({
  defaultVal: "",
  fieldPath: "currentLevel",
  parseFn: parseCurrentLevel,
  testName: "parses current level",
  testVal: "L2-W",
});
stringOrNumTests({
  defaultVal: emptyStudent.age.toString(),
  fieldPath: "age",
  isNum: true,
  parseFn: parseAge,
  testName: "parses age",
  testVal: "20",
});
stringOrNumTests({
  fieldPath: "placement.sectionsOffered",
  parseFn: parseSectionsOffered,
  testName: "parses sections offered",
  testVal: "L2MW A,B",
});
stringOrNumTests({
  fieldPath: "placement.photoContact",
  parseFn: parsePhotoContact,
  testName: "parses photo contact",
  testVal: "Y 10/22/2021",
});
stringOrNumTests({
  defaultVal: emptyStudent.work.occupation,
  fieldPath: "work.occupation",
  parseFn: parseOccupation,
  testName: "parses occupation",
  testVal: "Student at Al Al Bayt",
});
stringOrNumTests({
  fieldPath: "work.lookingForJob",
  parseFn: parseLookingForJob,
  testName: "parses looking for job",
  testVal: "wants a job",
});
stringOrNumTests({
  fieldPath: "work.teachingSubjectAreas",
  parseFn: parseTeachingSubjectAreas,
  testName: "parses teaching subject areas",
  testVal: "Arabic",
});
stringOrNumTests({
  fieldPath: "work.englishTeacherLocation",
  parseFn: parseEnglishTeacherLocation,
  testName: "parses english teacher location",
  testVal: "high school",
});
stringOrNumTests({
  fieldPath: "phone.waBroadcastSAR",
  parseFn: parseWABroadcastSAR,
  testName: "parses wa broadvase sar",
  testVal: "Y SAR Group 5",
});
stringOrNumTests({
  fieldPath: "literacy.tutorAndDate",
  parseFn: parseLiteracyTutor,
  testName: "parses literacy tutor",
  testVal: "Mosa (Fall II 17)",
});
stringOrNumTests({ fieldPath: "zoom", parseFn: parseZoomTutor, testName: "parses zoom", testVal: "Charity" });
stringOrNumTests({
  fieldPath: "certificateRequests",
  parseFn: parseCertRequests,
  testName: "parses certificate requests",
  testVal: "1/22/21; L1-M cert",
});
stringOrNumTests({
  defaultVal: "",
  fieldPath: "origPlacementData.writing",
  parseFn: parseOrigPlacementWriting,
  testName: "parses original placement writing",
  testVal: "L1-",
});
stringOrNumTests({
  defaultVal: "",
  fieldPath: "origPlacementData.speaking",
  parseFn: parseOrigPlacementSpeaking,
  testName: "parses original placement speaking",
  testVal: "L3+",
});
stringOrNumTests({
  defaultVal: "",
  fieldPath: "origPlacementData.level",
  parseFn: parseOrigPlacementLevel,
  testName: "parses original placement level",
  testVal: "L5",
});
stringOrNumTests({
  fieldPath: "origPlacementData.adjustment",
  parseFn: parseOrigPlacementAdjustment,
  testName: "parses original placement adjustment",
  testVal: "Move to L4",
});
stringOrNumTests({
  fieldPath: "covidVaccine.reason",
  parseFn: parseCovidReason,
  testName: "parses covidVaccine reason",
  testVal: "Age",
});
stringOrNumTests({
  fieldPath: "covidVaccine.suspectedFraudReason",
  parseFn: parseCovidSuspectedFraudReason,
  testName: "parses covidVaccine suspected fraud reason",
  testVal: "Full name on certificate does not match",
});
stringOrNumTests({
  fieldPath: "familyCoordinatorEntry",
  parseFn: parseFamilyCoordinator,
  testName: "parses family coordinator",
  testVal: "Ellis",
});
stringOrNumTests({
  fieldPath: "status.audit",
  parseFn: parseAudit,
  testName: "parses audit",
  testVal: "PL1-M Sp I 22",
});

describe("test expand", () => {
  const pKeys = generateKeys("P", 10);
  it("generates keys", () => {
    expect(pKeys).toEqual("P,P0,P1,P2,P3,P4,P5,P6,P7,P8,P9");
  });
  it("expands keys", () => {
    const fieldObj: ValidFields = {};
    fieldObj[pKeys] = () => {
      // eslint-disable-next-line no-useless-return
      return;
    };
    const expandedFieldObj = expand(fieldObj);
    expect(expandedFieldObj.P).toBeDefined();
    expect(expandedFieldObj.P0).toBeDefined();
    expect(expandedFieldObj.P1).toBeDefined();
    expect(expandedFieldObj.P2).toBeDefined();
    expect(expandedFieldObj.P3).toBeDefined();
    expect(expandedFieldObj.P4).toBeDefined();
    expect(expandedFieldObj.P5).toBeDefined();
    expect(expandedFieldObj.P6).toBeDefined();
    expect(expandedFieldObj.P7).toBeDefined();
    expect(expandedFieldObj.P8).toBeDefined();
    expect(expandedFieldObj.P9).toBeDefined();
  });
});

describe("parses wa primary phone", () => {
  it("parses correct phone", () => {
    parseWaPrimPhone("", "700000000", student);
    expect(student.phone.primaryPhone).toEqual(700000000);
  });
  it("parses leading 0 phone", () => {
    parseWaPrimPhone("", "0700000000", student);
    expect(student.phone.primaryPhone).toEqual(700000000);
  });
  it("parses phone with spaces", () => {
    parseWaPrimPhone("", "070 000 0000", student);
    expect(student.phone.primaryPhone).toEqual(700000000);
  });
  it("parses phone with note", () => {
    parseWaPrimPhone("", "0700000000 (WA Note)", student);
    expect(student.phone.primaryPhone).toEqual(700000000);
  });
  it("doesn't parse text", () => {
    parseWaPrimPhone("", "No WA", student);
    expect(student.phone.primaryPhone).toEqual(-1);
  });
  it("parses foreign number", () => {
    parseWaPrimPhone("", "+900 11 222 3333", student);
    expect(student.phone.primaryPhone).toEqual(900112223333);
  });
});

describe("parses nationality", () => {
  it("doesn't parse blank", () => {
    parseNationality("JDN", "", student);
    expect(student.nationality).toEqual(Nationality.UNKNWN);
  });
  it("parses Jordanian", () => {
    parseNationality("JDN", "1", student);
    expect(student.nationality).toEqual(Nationality.JDN);
  });
  it("parses Syrian", () => {
    parseNationality("SYR", "1", student);
    expect(student.nationality).toEqual(Nationality.SYR);
  });
  it("parses Iraqi", () => {
    parseNationality("IRQ", "1", student);
    expect(student.nationality).toEqual(Nationality.IRQ);
  });
  it("parses Egyptian", () => {
    parseNationality("EGY", "1", student);
    expect(student.nationality).toEqual(Nationality.EGY);
  });
  it("parses Indonesian", () => {
    parseNationality("IND-NES", "1", student);
    expect(student.nationality).toEqual(Nationality.INDNES);
  });
  it("parses Yemeni", () => {
    parseNationality("YEM", "1", student);
    expect(student.nationality).toEqual(Nationality.YEM);
  });
  it("parses CE AFR", () => {
    parseNationality("CE AFR RE", "1", student);
    expect(student.nationality).toEqual(Nationality.CEAFRRE);
  });
  it("parses Chinese", () => {
    parseNationality("CHI", "1", student);
    expect(student.nationality).toEqual(Nationality.CHI);
  });
  it("parses Korean", () => {
    parseNationality("KOR", "1", student);
    expect(student.nationality).toEqual(Nationality.KOR);
  });
  it("parses Unknown", () => {
    parseNationality("UN-KNWN", "1", student);
    expect(student.nationality).toEqual(Nationality.UNKNWN);
  });
});

describe("parses current status", () => {
  it("parses NEW", () => {
    parseCurrentStatus("", "NEW", student);
    expect(student.status.currentStatus).toEqual(Status.NEW);
  });
  it("parses WD", () => {
    parseCurrentStatus("", "WD", student);
    expect(student.status.currentStatus).toEqual(Status.WD);
  });
  it("parses RET", () => {
    parseCurrentStatus("", "RET", student);
    expect(student.status.currentStatus).toEqual(Status.RET);
  });
});

describe("parses correspondence", () => {
  const test1Note1 =
    "S came in and registered him and said he doesn't know any English.  He was supposed to take a PE 9-5-18 but didn't show up because of work.  I exempted him without having seen him.";
  it("parses one line", () => {
    parseCorrespondence("", `9/6/18: ${test1Note1}`, student);
    expect(student.correspondence).toEqual([{ date: "9/6/2018", notes: test1Note1 }]);
  });
  const test2Note1 = "he asked me to change the class time; I said no.";
  const test2Note2 =
    "He popped up randomly in response to a WA BC and indicated he wanted to return; I said you never came in the past; he said he didn't know, ummm okayyy… I said I will send him a CS next session.";
  const test2Note3 =
    "He never responded to Fa I 21 CS nor WPM sent 7/18/21; haven't heard a peep from him at all.  Changing tag back to N.";
  it("parses multiple lines", () => {
    parseCorrespondence("", `1/15/19: ${test2Note1} 12/15/20: ${test2Note2}  9/21/21: ${test2Note3}`, student);
    expect(student.correspondence).toEqual([
      { date: "1/15/2019", notes: test2Note1 },
      { date: "12/15/2020", notes: test2Note2 },
      { date: "9/21/2021", notes: test2Note3 },
    ]);
  });
  const test3Note1 =
    "I am so confused.  I got a message from him as if I'd texted him about why he didn't come to class.";
  const test3Note2 =
    "I just did a flurry of messages to students this evening who have to be disenrolled, but I didn't send a message to this kid and I've only got one phone # for him on record.  Weird.";
  it("parses multiple cells", () => {
    parseCorrespondence("", `1/8/21: ${test3Note1}`, student);
    parseCorrespondence("", test3Note2, student);
    expect(student.correspondence).toEqual([{ date: "1/8/2021", notes: `${test3Note1} ${test3Note2}` }]);
  });
  it("parses YYYY date", () => {
    parseCorrespondence("", `1/8/2021: ${test3Note1}`, student);
    expect(student.correspondence).toEqual([{ date: "1/8/2021", notes: `${test3Note1}` }]);
  });
  it("parses M-D-YY date", () => {
    parseCorrespondence("", `1-8-21: ${test3Note1}`, student);
    expect(student.correspondence).toEqual([{ date: "1/8/2021", notes: `${test3Note1}` }]);
  });
  it("doesn't parse empty", () => {
    parseCorrespondence("", "", student);
    expect(student.correspondence).toEqual([]);
  });
});

describe("parses gender", () => {
  it("parses male", () => {
    parseGender("M", "1", student);
    expect(student.gender).toEqual("M");
  });
  it("parses female", () => {
    parseGender("M", "", student);
    expect(student.gender).toEqual("F");
  });
});

describe("parses phone", () => {
  const firstPhoneExpects = ({ note, number }: { note?: string; number?: number }) => {
    const phone = first(student.phone.phoneNumbers);
    expect(student.phone.phoneNumbers).toHaveLength(1);
    expect(phone?.number).toEqual(number || 700000000);
    note ? expect(phone?.notes).toEqual(note) : expect(phone?.notes).toBeUndefined();
  };
  it("parses normal phone", () => {
    parsePhone("", "700000000", student);
    firstPhoneExpects({});
  });
  it("parses leading 0 phone", () => {
    parsePhone("", "0700000000", student);
    firstPhoneExpects({});
  });
  it("parses phone with spaces", () => {
    parsePhone("", "070 000 0000", student);
    firstPhoneExpects({});
  });
  it("parses phone with note", () => {
    const note = "WA Note";
    parsePhone("", `0700000000 (${note})`, student);
    firstPhoneExpects({ note });
  });
  it("doesn't parse text", () => {
    parsePhone("", "No WA", student);
    expect(student.phone.phoneNumbers).toEqual([]);
  });
  it("doesn't parse empty", () => {
    parsePhone("", "", student);
    expect(student.phone.phoneNumbers).toEqual([]);
  });
  it("parses foreign number", () => {
    parsePhone("", "+900 11 222 3333", student);
    firstPhoneExpects({ number: 900112223333 });
  });
  it("parses many numbers", () => {
    const number = "70000000";
    const note = "WA Note";
    parsePhone("", `${number}0 (${note} 0)`, student);
    parsePhone("", `${number}1 (${note} 1)`, student);
    parsePhone("", `0${number}2`, student);
    expect(student.phone.phoneNumbers).toEqual([
      { notes: `${note} 0`, number: Number(`${number}0`) },
      { notes: `${note} 1`, number: Number(`${number}1`) },
      { number: Number(`${number}2`) },
    ]);
  });
});

describe("parses other broadcast groups", () => {
  const [group1, group2, group3] = ["WA BC SAR L3-5W", "WA BC SAR Eng Tchrs", "WA BC SAR Eng Tchrs L3-5"];
  it("parses Y", () => {
    parseWABroadcasts(group1, "Y", student);
    expect(student.phone.otherWaBroadcastGroups).toEqual([group1]);
  });
  it("parses 1", () => {
    parseWABroadcasts(group1, "1", student);
    expect(student.phone.otherWaBroadcastGroups).toEqual([group1]);
  });
  it("parses Y with notes", () => {
    parseWABroadcasts(group1, "Y (both #s)", student);
    expect(student.phone.otherWaBroadcastGroups).toEqual([group1]);
  });
  it("parses multiple groups", () => {
    parseWABroadcasts(group1, "Y", student);
    parseWABroadcasts(group2, "Y", student);
    parseWABroadcasts(group3, "Y", student);
    expect(student.phone.otherWaBroadcastGroups).toEqual([group1, group2, group3]);
  });
  it("doesn't parse N", () => {
    parseWABroadcasts(group1, "N", student);
    expect(student.phone.otherWaBroadcastGroups).toBeUndefined();
  });
  it("doesn't parse empty", () => {
    parseWABroadcasts(group1, "", student);
    expect(student.phone.otherWaBroadcastGroups).toBeUndefined();
  });
});

describe("parses initial session", () => {
  const [session1, session2, session3] = ["SP I 21", "FA 1 21", "FA II 21"];
  it("parses 1", () => {
    parseInitialSession(session1, "1", student);
    expect(student.initialSession).toEqual("Sp I 21");
  });
  it("doesn't parse empty string", () => {
    parseInitialSession(session1, "", student);
    expect(student.initialSession).toEqual(emptyStudent.initialSession);
  });
  it("parses older session", () => {
    parseInitialSession(session1, "1", student);
    parseInitialSession(session2, "", student);
    parseInitialSession(session3, "", student);
    expect(student.initialSession).toEqual("Sp I 21");
  });
  it("parses newer session", () => {
    parseInitialSession(session1, "", student);
    parseInitialSession(session2, "", student);
    parseInitialSession(session3, "1", student);
    expect(student.initialSession).toEqual("Fa II 21");
  });
});

describe("parses dropped out reason", () => {
  const reasons = Object.entries(DroppedOutReason);
  forEach(reasons, ([key, val]) => {
    it(`parses ${val}`, () => {
      parseDropoutReason(val, "1", student);
      expect(student.status.droppedOutReason).toEqual(DroppedOutReason[key as keyof typeof DroppedOutReason]);
    });
  });
  it("doesn't parse empty", () => {
    parseDropoutReason("Lack of Familial Support", "", student);
    expect(student.status.droppedOutReason).toBeUndefined();
  });
});

describe("parses academic record", () => {
  const basicRecord: AcademicRecord = {
    attendance: 96,
    comments: "Ahmed was a great student",
    exitSpeakingExam: {
      percentage: 92,
      result: FinalResult.P,
    },
    exitWritingExam: {
      notes: "Failed last time",
      percentage: 88,
      result: FinalResult.P,
    },
    finalResult: {
      percentage: 85,
      result: FinalResult.P,
    },
    level: "L2-M",
    session: "Fa II 21",
  };
  const basicRecordFields = [
    "Fa II 21",
    "L2-M",
    "",
    "1",
    "",
    "",
    "85%",
    "P 88% (Failed last time)",
    "P 92%",
    "96%",
    "Ahmed was a great student",
  ];
  const withdrawnRecord: AcademicRecord = {
    attendance: 10,
    finalResult: {
      notes: "No FGR",
      result: FinalResult.WD,
    },
    level: "L3",
    session: "Sp I 21",
  };
  const withdrawnRecordFields = ["Sp I 21", "L3", "", "", "", "1", "No FGR", "", "", "10%", ""];
  const oldRecord: AcademicRecord = {
    attendance: 69,
    exitWritingExam: {
      result: FinalResult.F,
    },
    finalResult: {
      notes: "R4 Fa I 17",
      percentage: 76,
      result: FinalResult.F,
    },
    level: "L4",
    levelAudited: "L3",
    session: "Fa I 17",
  };
  const oldRecordFields = ["Fa I 17", "L4", "L3", "", "1", "", "R4 Fa I 17 (76%);", "F", "", "R4: 69%"];
  const speakingInWritingRecord: AcademicRecord = {
    attendance: 94,
    comments: "Teacher does not recommend passing.",
    exitSpeakingExam: {
      percentage: 83,
      result: FinalResult.P,
    },
    exitWritingExam: {
      percentage: 71,
      result: FinalResult.F,
    },
    finalResult: {
      percentage: 90,
      result: FinalResult.F,
    },
    level: "PL1-M",
    session: "Sp I 21",
  };
  const speakingInWritingRecordFields = [
    "Sp I 21",
    "PL1-M",
    "",
    "",
    "1",
    "",
    "90%",
    "Wrtg: F (71); Spkg: P (83)",
    "",
    "94%",
    "Teacher does not recommend passing.",
  ];

  const recordParse = (values: string[]) => {
    const [session, level, audit, P, F, WD, finalGrades, exitWriting, exitSpeaking, attendance, comments] = values;
    parseAcademicRecordSession("", session, student);
    parseAcademicRecordLevel("", level, student);
    parseAcademicRecordAudit("", audit, student);
    parseAcademicRecordResult("P", P, student);
    parseAcademicRecordResult("F", F, student);
    parseAcademicRecordResult("WD", WD, student);
    parseAcademicRecordFinalGrade("", finalGrades, student);
    parseAcademicRecordExitWritingExam("", exitWriting, student);
    parseAcademicRecordExitSpeakingExam("", exitSpeaking, student);
    parseAcademicRecordAttendance("", attendance, student);
    parseAcademicRecordTeacherComments("", comments, student);
  };
  it("parses basic record", () => {
    recordParse(basicRecordFields);
    expect(student.academicRecords).toEqual([basicRecord]);
  });
  it("parses withdrawn record", () => {
    recordParse(withdrawnRecordFields);
    expect(student.academicRecords).toEqual([withdrawnRecord]);
  });
  it("parses multiple records", () => {
    recordParse(withdrawnRecordFields);
    recordParse(basicRecordFields);
    expect(student.academicRecords).toEqual([withdrawnRecord, basicRecord]);
  });
  it("parses old record", () => {
    recordParse(oldRecordFields);
    expect(student.academicRecords).toEqual([oldRecord]);
  });
  it("parses speaking exam in writing field", () => {
    recordParse(speakingInWritingRecordFields);
    expect(student.academicRecords).toEqual([speakingInWritingRecord]);
  });
});

describe("parses covidVaccine status", () => {
  it("parses jordanian unvaccd", () => {
    parseCovidStatus("JORDANIAN UNVACC'D", "1", student);
    expect(student.covidVaccine.status).toEqual(CovidStatus.UNV);
  });
  it("parses syrian unvaccd", () => {
    parseCovidStatus("SYRIAN UNVACC'D", "1", student);
    expect(student.covidVaccine.status).toEqual(CovidStatus.UNV);
  });
  it("parses other nationality unvaccd", () => {
    parseCovidStatus("OTHER NATIONALITY UNVACC'D", "1", student);
    expect(student.covidVaccine.status).toEqual(CovidStatus.UNV);
  });
  it("parses jordanian partially vaccd", () => {
    parseCovidStatus("JORDANIAN PARTIALLY VACC'D", "1", student);
    expect(student.covidVaccine.status).toEqual(CovidStatus.PART);
  });
  it("parses syrian partially vaccd", () => {
    parseCovidStatus("SYRIAN PARTIALLY VACC'D", "1", student);
    expect(student.covidVaccine.status).toEqual(CovidStatus.PART);
  });
  it("parses other nationality partially vaccd", () => {
    parseCovidStatus("OTHER NATIONALITY PARTIALLY VACC'D", "1", student);
    expect(student.covidVaccine.status).toEqual(CovidStatus.PART);
  });
  it("parses jordanian fully vaccd", () => {
    parseCovidStatus("JORDANIAN FULLY VACC'D", "1", student);
    expect(student.covidVaccine.status).toEqual(CovidStatus.FULL);
  });
  it("parses syrian fully vaccd", () => {
    parseCovidStatus("SYRIAN FULLY VACC'D", "1", student);
    expect(student.covidVaccine.status).toEqual(CovidStatus.FULL);
  });
  it("parses other nationality fully vaccd", () => {
    parseCovidStatus("OTHER NATIONALITY FULLY VACC'D", "1", student);
    expect(student.covidVaccine.status).toEqual(CovidStatus.FULL);
  });
  it("parses exempt from vaccine", () => {
    parseCovidStatus("EXEMPT FROM VACCINE", "1", student);
    expect(student.covidVaccine.status).toEqual(CovidStatus.EXEMPT);
  });
  it("parses boosted vaccine", () => {
    parseCovidStatus("BOOSTER (THIRD DOSE)", "1", student);
    expect(student.covidVaccine.status).toEqual(CovidStatus.BOOST);
  });
  it("parses boosted vaccine", () => {
    parseCovidStatus("BOOSTER (THIRD DOSE)", "1", student);
    expect(student.covidVaccine.status).toEqual(CovidStatus.BOOST);
  });
  it("parses unclear answer", () => {
    parseCovidStatus("ANSWERED BUT ANSWER UNCLEAR", "1", student);
    expect(student.covidVaccine.status).toEqual(CovidStatus.UNCL);
  });
  it("parses declined answer", () => {
    parseCovidStatus("DECLINED TO PROVIDE VACCINE INFO", "1", student);
    expect(student.covidVaccine.status).toEqual(CovidStatus.DECL);
  });
  it("doesn't parse empty", () => {
    parseCovidStatus("DECLINED TO PROVIDE VACCINE INFO", "", student);
    expect(student.covidVaccine.status).toEqual(CovidStatus.NORPT);
  });
  it("doesn't parse non-1", () => {
    parseCovidStatus("DECLINED TO PROVIDE VACCINE INFO", "2", student);
    expect(student.covidVaccine.status).toEqual(CovidStatus.NORPT);
    parseCovidStatus("DECLINED TO PROVIDE VACCINE INFO", "No", student);
    expect(student.covidVaccine.status).toEqual(CovidStatus.NORPT);
  });
});
