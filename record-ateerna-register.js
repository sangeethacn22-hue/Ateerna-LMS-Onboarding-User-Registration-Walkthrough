import { chromium } from "@playwright/test";

(async () => {
  // 1. Launch browser with natural pacing for a tutorial video
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000,
  });

  // 2. Set recording context
  const context = await browser.newContext({
    recordVideo: {
      dir: "videos/ateerna_registration/",
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();

  // Helper function to show a floating tutorial guidance badge on the screen
  async function showTutorialStep(message) {
    await page.evaluate((text) => {
      let banner = document.getElementById("tutorial-instruction-banner");
      if (!banner) {
        banner = document.createElement("div");
        banner.id = "tutorial-instruction-banner";
        banner.style.position = "fixed";
        banner.style.top = "24px";
        banner.style.left = "50%";
        banner.style.transform = "translateX(-50%)";
        banner.style.backgroundColor = "#1e293b";
        banner.style.color = "#38bdf8";
        banner.style.padding = "12px 24px";
        banner.style.borderRadius = "10px";
        banner.style.fontSize = "18px";
        banner.style.fontWeight = "600";
        banner.style.boxShadow = "0 10px 25px -5px rgba(0,0,0,0.5)";
        banner.style.border = "2px solid #38bdf8";
        banner.style.zIndex = "999999";
        banner.style.fontFamily = "Arial, sans-serif";
        banner.style.transition = "all 0.3s ease";
        document.body.appendChild(banner);
      }
      banner.innerText = text;
    }, message);
    await page.waitForTimeout(2200);
  }

  // Helper function to display guidance inside an input before typing
  async function guidedFill(locator, promptText, actualValue) {
    if (await locator.isVisible({ timeout: 2500 }).catch(() => false)) {
      await locator.scrollIntoViewIfNeeded();
      // Show instructional hint text first
      await locator.fill(promptText);
      await page.waitForTimeout(1800);
      // Clear and type the actual sample user data
      await locator.fill("");
      await locator.type(actualValue, { delay: 100 });
      await page.waitForTimeout(1000);
    }
  }

  // --- Step 1: Open Website ---
  await page.goto("https://lms.ateerna.com/login");
  await page.waitForLoadState("domcontentloaded");
  await showTutorialStep("Welcome to Ateerna LMS Registration Guide");

  // --- Step 2: Navigate to Register ---
  await showTutorialStep(
    'Step 1: Click "Sign Up / Register" to create a new account',
  );
  const registerTrigger = page
    .locator("text=/sign up|register|create account|new user/i")
    .first();

  if (await registerTrigger.isVisible({ timeout: 3000 }).catch(() => false)) {
    await registerTrigger.click();
    await page.waitForTimeout(2000);
  } else {
    await page.goto("https://lms.ateerna.com/register").catch(() => {});
    await page.waitForTimeout(2000);
  }

  // Generate test credentials
  const timestamp = Date.now();
  const sampleName = "Sangeetha";
  const sampleEmail = `sangeetha_${timestamp}@example.com`;
  const samplePhone = "9876543210";
  const samplePassword = "UserPass@2026";

  // --- Step 3: Enter Full Name ---
  await showTutorialStep("Step 2: Enter your Full Name");
  const nameInput = page
    .locator(
      'input[name*="name" i], input[placeholder*="name" i], input[id*="name" i]',
    )
    .first();
  await guidedFill(
    nameInput,
    "👉 Please enter your full name here...",
    sampleName,
  );

  // --- Step 4: Enter Email ---
  await showTutorialStep("Step 3: Enter your Email Address");
  const emailInput = page
    .locator(
      'input[type="email"], input[name*="email" i], input[placeholder*="email" i]',
    )
    .first();
  await guidedFill(
    emailInput,
    "👉 Enter your valid email address...",
    sampleEmail,
  );

  // --- Step 5: Enter Mobile Number (if present) ---
  const phoneInput = page
    .locator(
      'input[type="tel"], input[name*="phone" i], input[name*="mobile" i], input[placeholder*="phone" i]',
    )
    .first();
  if (await phoneInput.isVisible({ timeout: 1500 }).catch(() => false)) {
    await showTutorialStep("Step 4: Enter your Contact Number");
    await guidedFill(
      phoneInput,
      "👉 Enter your 10-digit mobile number...",
      samplePhone,
    );
  }

  // --- Step 6: Enter Password ---
  await showTutorialStep("Step 5: Create a secure password");
  const passwordInputs = page.locator('input[type="password"]');
  const count = await passwordInputs.count();
  if (count > 0) {
    await guidedFill(
      passwordInputs.nth(0),
      "👉 Create a secure password...",
      samplePassword,
    );
    if (count > 1) {
      await showTutorialStep("Step 6: Confirm your password");
      await guidedFill(
        passwordInputs.nth(1),
        "👉 Re-type password to confirm...",
        samplePassword,
      );
    }
  }

  // --- Step 7: Submit Registration ---
  await showTutorialStep('Step 7: Click "Register" to finish sign-up');
  const submitBtn = page
    .locator(
      'button[type="submit"], button:has-text("Register"), button:has-text("Sign Up"), button:has-text("Create")',
    )
    .first();
  if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await submitBtn.click();
  }

  await showTutorialStep("Registration Submitted! Welcome to Ateerna.");
  await page.waitForTimeout(3500);

  // Capture video handle prior to context close
  const video = page.video();

  await context.close();
  await browser.close();

  // Save clean, professional filename to eliminate hash overlay in media players
  if (video) {
    await video.saveAs(
      "videos/ateerna_registration/ateerna-registration-tutorial.webm",
    );
  }

  console.log(
    "Tutorial video generated: videos/ateerna_registration/ateerna-registration-tutorial.webm",
  );
})();
