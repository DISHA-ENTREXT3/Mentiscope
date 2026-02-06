import { test, expect, type Page } from '@playwright/test';

test('homepage has title', async ({ page }: { page: Page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Mentiscope/);
});

test('onboarding link works', async ({ page }: { page: Page }) => {
  await page.goto('/');
  // Find the link/button that starts the process. Adjust the locator as needed for your specific design.
  // Using a broader locator strategy to catch standard "Get Started" or "Begin" calls to action.
  const onboardingLink = page.getByRole('link', { name: /Get Started|Start Onboarding|Begin/i }).first();
  
  await expect(onboardingLink).toBeVisible();
  await onboardingLink.click();
  await expect(page).toHaveURL(/.*onboarding/);
});
