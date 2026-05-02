import { CustomFixtures } from "./fixtures/base.fixture";

declare global {
  namespace PlaywrightTest {
    interface TestArgs extends CustomFixtures {}
  }
}