import { test, expect, Page } from '@playwright/test';

test('Main flow works fine', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Play' }).click();
  const input = page.getByPlaceholder('Your name');
  await expect(input).toBeVisible();
  const playerName: string = 'playerName';
  await input.fill(playerName);
  await expect(input).toHaveValue(playerName);
  await page.keyboard.press('Enter');
  await expect(page.getByText('HP: 100 / 100')).toBeVisible();
  expect(page.locator('canvas')).toBeVisible();
  await page.getByRole('button', { name: 'Disconnect' }).click();
  await expect(input).toBeVisible();
});

test('Player moves and disconnects', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Play' }).click();
  const input = page.getByPlaceholder('Your name');
  await expect(input).toBeVisible();
  await input.fill('playerName');
  await page.getByRole('button', { name: 'Join' }).click();
  await expect(page.getByText('HP: 100 / 100')).toBeVisible();
  await testMovement({ page, key: 'w' });
  await testMovement({ page, key: 'a' });
  await testMovement({ page, key: 's' });
  await testMovement({ page, key: 'd' });
  await page.getByRole('button', { name: 'Disconnect' }).click();
  await expect(input).toBeVisible();
});

const testMovement = async ({ page, key }: { page: Page; key: string }) => {
  const positionLocator = page.getByText(/x:\d+\.\d{2} y:\d+\.\d{2}/);
  await expect(positionLocator).toBeVisible();

  const initialText = await positionLocator.textContent();

  await page.keyboard.down(key);
  await expect(positionLocator).not.toHaveText(initialText!);
  await page.keyboard.up(key);
};
