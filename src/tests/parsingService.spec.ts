import { cloneDeep } from "lodash";
import { emptyStudent, Nationality, Student } from "../interfaces";
import {
  expand,
  generateKeys,
  parseArabicName,
  parseEnglishName,
  parseID,
  parseInviteTag,
  parseNationality,
  parseWaPrimPhone,
  ValidFields,
} from "../services";

let student: Student;

beforeEach(() => {
  student = cloneDeep(emptyStudent);
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

describe("parses names", () => {
  it("parses English name", () => {
    parseEnglishName("", "Jon Ellis", student);
    expect(student.name.english).toEqual("Jon Elli");
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

describe("parse wa primary phone", () => {
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

describe("parse nationality", () => {
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

describe("parses invite tag", () => {
  it("parses Y tag", () => {
    parseInviteTag("Y", "1", student);
    expect(student.status.inviteTag).toEqual(true);
  });
  it("parses N tag", () => {
    parseInviteTag("Y", "", student);
    expect(student.status.inviteTag).toEqual(false);
  });
});

export {};
