import { test, expect } from '@playwright/test';

test('Main flow works fine', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Play' }).click();
  const input = page.getByPlaceholder('Your idea');
  await expect(input).toBeVisible();
});
