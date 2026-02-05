import { test, expect, type Page } from '@playwright/test';

test('homepage has title', async ({ page }: { page: Page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Mentiscope/);
});

test('onboarding link works', async ({ page }: { page: Page }) => {
  await page.goto('/');
  const onboardingLink = page.getByRole('link', { name: /Get Started|Start Onboarding/i });
  const count = await onboardingLink.count();
  if (count > 0) {
    await onboardingLink.click();
    await expect(page).toHaveURL(/.*onboarding/);
  }
});
