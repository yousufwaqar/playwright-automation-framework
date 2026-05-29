import { faker } from "@faker-js/faker";

/**
 * DataFactory - Utility for generating dynamic test data
 *
 * Uses Faker.js to create realistic, randomized data for testing,
 * which helps uncover edge cases and avoids data collisions.
 */
export class DataFactory {
  /**
   * Generate a random user object
   */
  static getRandomUser() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
      phoneNumber: faker.phone.number(),
      company: faker.company.name(),
      jobTitle: faker.person.jobTitle(),
    };
  }

  /**
   * Generate a random report name
   */
  static getRandomReportName(): string {
    return `${faker.commerce.department()} ${faker.date.month()} Report`;
  }

  /**
   * Generate a random search query
   */
  static getRandomSearchQuery(): string {
    return faker.commerce.productName();
  }
}
