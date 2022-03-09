import { cloneDeep, get } from "lodash";
import { emptyStudent, Nationality, Status, Student } from "../interfaces";
import {
  expand,
  generateKeys,
  parseArabicName,
  parseAudit,
  parseClassListSent,
  parseClassListSentDate,
  parseCorrespondence,
  parseCurrentLevel,
  parseCurrentStatus,
  parseEnglishName,
  parseFgrDate,
  parseID,
  parseInviteTag,
  parseLevelReevalDate,
  parseNationality,
  parseNCL,
  parseNoAnswerClassSchedule,
  parsePendingPlacement,
  parsePhotoContact,
  parsePlacement,
  parsePlacementConfDate,
  parseReactivatedDate,
  parseSectionsOffered,
  parseWaPrimPhone,
  parseWithdrawDate,
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
    it("parses non-date", () => {
      parseFn("", "NA 1/24/21", student);
      expect(get(student, fieldPath)).toEqual("NA 1/24/21");
    });
    it("doesn't parse empty string", () => {
      parseFn("", "", student);
      expect(get(student, fieldPath)).toBeUndefined();
    });
  });
};

const optionalStringTests = ({ fieldPath, parseFn, testName, testString }: TestFnParams & { testString: string }) => {
  describe(testName, () => {
    it("parses string", () => {
      parseFn("", testString, student);
      expect(get(student, fieldPath)).toEqual(testString);
    });
    it("doesn't parse empty string", () => {
      parseFn("", "", student);
      expect(get(student, fieldPath)).toBeUndefined();
    });
  });
};

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

describe("parses names", () => {
  it("parses English name", () => {
    parseEnglishName("", "Jon Ellis", student);
    expect(student.name.english).toEqual("Jon Ellis");
  });
  it("parses Arabic name", () => {
    parseArabicName("", "جون إليس", student);
    expect(student.name.arabic).toEqual("جون إليس");
  });
  it("parses empty Arabic name as N/A", () => {
    parseArabicName("", "", student);
    expect(student.name.arabic).toEqual("N/A");
  });
});

describe("parses id", () => {
  it("parses correct id", () => {
    parseID("", "12345", student);
    expect(student.epId).toEqual(12345);
  });
  it("doesn't parse string", () => {
    parseID("", "ID", student);
    expect(student.epId).toEqual(0);
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

describe("parses current level", () => {
  it("parses correct level", () => {
    parseCurrentLevel("", "L2-W", student);
    expect(student.currentLevel).toEqual("L2-W");
  });
  it("parses incorrect level", () => {
    parseCurrentLevel("", "UNC", student);
    expect(student.currentLevel).toEqual("UNC");
  });
});

requiredBooleanTests({ fieldPath: "status.inviteTag", parseFn: parseInviteTag, testName: "parses invite tag" });
requiredBooleanTests({
  fieldPath: "status.noContactList",
  parseFn: parseNCL,
  testName: "parses no contact list",
});
optionalBooleanTests({ fieldPath: "status.audit", parseFn: parseAudit, testName: "parses audit" });
optionalBooleanTests({
  fieldPath: "placement.pending",
  parseFn: parsePendingPlacement,
  testName: "parses pending placement",
});
dateTests({ fieldPath: "status.finalGradeSentDate", parseFn: parseFgrDate, testName: "parses FGR date" });
dateTests({
  fieldPath: "status.levelReevalDate",
  parseFn: parseLevelReevalDate,
  testName: "parses level reeval date",
});
dateTests({
  fieldPath: "status.reactivatedDate",
  parseFn: parseReactivatedDate,
  testName: "parses reactivated date",
});
dateTests({ fieldPath: "status.withdrawDate", parseFn: parseWithdrawDate, testName: "parses withdraw date" });
dateTests({
  fieldPath: "placement.confDate",
  parseFn: parsePlacementConfDate,
  testName: "parses placement conf date",
});
dateTests({
  fieldPath: "placement.noAnswerClassSchedule",
  parseFn: parseNoAnswerClassSchedule,
  testName: "parses no answer class schedule",
});
dateTests({
  fieldPath: "classList.classListSentDate",
  parseFn: parseClassListSentDate,
  testName: "parses class list sent date",
});
optionalStringTests({
  fieldPath: "placement.sectionsOffered",
  parseFn: parseSectionsOffered,
  testName: "parses sections offered",
  testString: "L2MW A,B",
});
optionalStringTests({
  fieldPath: "placement.photoContact",
  parseFn: parsePhotoContact,
  testName: "parses photo contact",
  testString: "Y 10/22/2021",
});
optionalStringTests({
  fieldPath: "placement.placement",
  parseFn: parsePlacement,
  testName: "parses placement",
  testString: "CSWL PL1-M 2/10/22; sent CS 2/17/22; pending",
});
optionalStringTests({
  fieldPath: "classList.classListSentNotes",
  parseFn: parseClassListSent,
  testName: "parses class list sent notes",
  testString: "CSWL PL1-M 2/10/22; sent CS 2/17/22; pending",
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
