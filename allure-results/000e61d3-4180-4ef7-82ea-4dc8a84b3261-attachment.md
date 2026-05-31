# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-regression.spec.ts >> Visual Regression Tests >> should match dashboard layout snapshot @visual
- Location: tests/visual-regression.spec.ts:18:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('welcome-message')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByTestId('welcome-message')

```

# Page snapshot

```yaml
- generic [ref=e2]:
    - heading "Sign In" [level=1] [ref=e3]
    - generic [ref=e4]: Invalid email or password. Please try again.
    - generic [ref=e5]:
        - generic [ref=e6]:
            - generic [ref=e7]: Email
            - textbox "Email" [ref=e8]:
                - /placeholder: Enter your email
                - text: admin@example.com
        - generic [ref=e9]:
            - generic [ref=e10]: Password
            - textbox "Password" [ref=e11]:
                - /placeholder: Enter your password
                - text: password123
        - generic [ref=e12]:
            - checkbox "Remember me" [ref=e13]
            - generic [ref=e14]: Remember me
        - button "Sign In" [active] [ref=e15] [cursor=pointer]
        - button "Sign in with SSO" [ref=e16] [cursor=pointer]
    - link "Forgot Password?" [ref=e18] [cursor=pointer]:
        - /url: "#"
```

# Test source

```ts
  73  |    * Type text character by character (for inputs that need keystrokes)
  74  |    */
  75  |   async typeText(locator: Locator, text: string): Promise<void> {
  76  |     await locator.waitFor({ state: "visible", timeout: 10000 });
  77  |     await locator.pressSequentially(text, { delay: 50 });
  78  |   }
  79  |
  80  |   /**
  81  |    * Select an option from a dropdown by value
  82  |    */
  83  |   async selectByValue(locator: Locator, value: string): Promise<void> {
  84  |     await locator.selectOption({ value });
  85  |   }
  86  |
  87  |   /**
  88  |    * Select an option from a dropdown by visible text
  89  |    */
  90  |   async selectByText(locator: Locator, text: string): Promise<void> {
  91  |     await locator.selectOption({ label: text });
  92  |   }
  93  |
  94  |   /**
  95  |    * Hover over an element
  96  |    */
  97  |   async hover(locator: Locator): Promise<void> {
  98  |     await locator.hover();
  99  |   }
  100 |
  101 |   // ==========================================
  102 |   // Element State Checks
  103 |   // ==========================================
  104 |
  105 |   /**
  106 |    * Check if an element is visible
  107 |    */
  108 |   async isVisible(locator: Locator): Promise<boolean> {
  109 |     return locator.isVisible();
  110 |   }
  111 |
  112 |   /**
  113 |    * Check if an element is enabled
  114 |    */
  115 |   async isEnabled(locator: Locator): Promise<boolean> {
  116 |     return locator.isEnabled();
  117 |   }
  118 |
  119 |   /**
  120 |    * Get text content of an element
  121 |    */
  122 |   async getText(locator: Locator): Promise<string> {
  123 |     return (await locator.textContent()) || "";
  124 |   }
  125 |
  126 |   /**
  127 |    * Get attribute value of an element
  128 |    */
  129 |   async getAttribute(locator: Locator, attribute: string): Promise<string | null> {
  130 |     return locator.getAttribute(attribute);
  131 |   }
  132 |
  133 |   // ==========================================
  134 |   // Wait Utilities
  135 |   // ==========================================
  136 |
  137 |   /**
  138 |    * Wait for an element to be visible
  139 |    */
  140 |   async waitForVisible(locator: Locator, timeout = 15000): Promise<void> {
  141 |     await locator.waitFor({ state: "visible", timeout });
  142 |   }
  143 |
  144 |   /**
  145 |    * Wait for an element to be hidden
  146 |    */
  147 |   async waitForHidden(locator: Locator, timeout = 15000): Promise<void> {
  148 |     await locator.waitFor({ state: "hidden", timeout });
  149 |   }
  150 |
  151 |   /**
  152 |    * Wait for page to finish loading
  153 |    */
  154 |   async waitForPageLoad(): Promise<void> {
  155 |     await this.page.waitForLoadState("networkidle");
  156 |   }
  157 |
  158 |   /**
  159 |    * Wait for a specific duration (use sparingly)
  160 |    */
  161 |   async wait(milliseconds: number): Promise<void> {
  162 |     await this.page.waitForTimeout(milliseconds);
  163 |   }
  164 |
  165 |   // ==========================================
  166 |   // Assertions
  167 |   // ==========================================
  168 |
  169 |   /**
  170 |    * Assert element is visible
  171 |    */
  172 |   async assertVisible(locator: Locator): Promise<void> {
> 173 |     await expect(locator).toBeVisible();
      |                           ^ Error: expect(locator).toBeVisible() failed
  174 |   }
  175 |
  176 |   /**
  177 |    * Assert element contains specific text
  178 |    */
  179 |   async assertText(locator: Locator, expectedText: string): Promise<void> {
  180 |     await expect(locator).toContainText(expectedText);
  181 |   }
  182 |
  183 |   /**
  184 |    * Assert page URL contains specific path
  185 |    */
  186 |   async assertUrlContains(path: string): Promise<void> {
  187 |     await expect(this.page).toHaveURL(new RegExp(path));
  188 |   }
  189 |
  190 |   /**
  191 |    * Assert page title
  192 |    */
  193 |   async assertTitle(expectedTitle: string): Promise<void> {
  194 |     await expect(this.page).toHaveTitle(expectedTitle);
  195 |   }
  196 |
  197 |   // ==========================================
  198 |   // Screenshots & Debugging
  199 |   // ==========================================
  200 |
  201 |   /**
  202 |    * Take a screenshot with a descriptive name
  203 |    */
  204 |   async takeScreenshot(name: string): Promise<void> {
  205 |     await this.page.screenshot({
  206 |       path: `test-results/screenshots/${name}.png`,
  207 |       fullPage: true,
  208 |     });
  209 |   }
  210 | }
  211 |
```
