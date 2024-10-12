import { InvalidUuidError, Uuid } from "../uuid.vo";
import { v4 as uuidv4 } from "uuid";

describe("Uuid Unit Tests", () => {
  it("should create a new Uuid", () => {
    const uuid = new Uuid();

    expect(uuid.id).toBeDefined();
    expect(uuid.id).toHaveLength(36);
  });

  it("should create a new Uuid with constructor", () => {
    const id = uuidv4();
    const uuid = new Uuid(id);

    expect(uuid.id).toBe(id);
  });

  it("should throw an error when trying to create a new Uuid with invalid id", () => {
    expect(() => {
      new Uuid("invalid-id");
    }).toThrow("ID must be a valid UUID");
  });
});
