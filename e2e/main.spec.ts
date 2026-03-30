import { test, expect } from '@playwright/test';

test('Main flow works fine', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Play' }).click();
  const input = page.getByPlaceholder('Your name');
  await expect(input).toBeVisible();
  await input.fill('jamonado');
  await expect(input).toHaveValue('jamonado');
  await page.keyboard.press('Enter');
  await expect(page.getByText('HP: 100 / 100')).toBeVisible();
  expect(page.locator('canvas')).toBeVisible();
});
