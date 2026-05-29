import { CustomFixtures } from "./fixtures/base.fixture";

declare global {
  namespace PlaywrightTest {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface TestArgs extends CustomFixtures {}
  }
}
