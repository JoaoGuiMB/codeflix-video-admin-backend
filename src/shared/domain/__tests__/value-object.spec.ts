import { ValueObject } from "../value-object";

class StringValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(readonly value1: string, readonly value2: string) {
    super();
  }
}

describe("ValueObject Unit Tests", () => {
  it("should be equals", () => {
    const vo1 = new StringValueObject("test");
    const vo2 = new StringValueObject("test");

    expect(vo1.equals(vo2)).toBe(true);

    const vo3 = new ComplexValueObject("test", "test");
    const vo4 = new ComplexValueObject("test", "test");

    expect(vo3.equals(vo4)).toBe(true);
  });

  it("should not be equals", () => {
    const vo1 = new StringValueObject("test");
    const vo2 = new StringValueObject("test2");

    expect(vo1.equals(vo2)).toBe(false);

    const vo3 = new ComplexValueObject("test", "test");
    const vo4 = new ComplexValueObject("test2", "test");

    expect(vo3.equals(vo4)).toBe(false);
  });
});
