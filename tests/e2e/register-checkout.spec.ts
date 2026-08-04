import { expect, test } from "@playwright/test";

test("registers, logs in, browses, adds to cart, and checks out", async ({ page }) => {
  const email = `buyer-${Date.now()}@example.com`;
  const password = "Password123!";

  await page.goto("/register");
  await page.getByText("I'm a Buyer").click();
  await page.getByPlaceholder("your@email.com").fill(email);
  await page.getByRole("button", { name: "Next" }).click();
  await page.locator('input[name="password"]').fill(password);
  await page.locator('input[name="confirmPassword"]').fill(password);
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByPlaceholder("Enter your full name").fill("E2E Buyer");
  await page.getByRole("button", { name: "Complete Registration" }).click();
  await expect(page.getByText("Account created successfully")).toBeVisible();

  await page.goto("/login");
  await page.getByPlaceholder("your@email.com").fill(email);
  await page.getByPlaceholder("Enter your password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto("/shop");
  await page.locator('a[href^="/products/"]').first().click();
  await page.getByRole("button", { name: /Add to Cart/i }).click();
  await expect(page.getByText("Added to cart.")).toBeVisible();

  await page.goto("/cart");
  await page.getByRole("button", { name: "Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout/);

  await page.getByPlaceholder("Phone number").fill("0911111111");
  await page.getByPlaceholder("City").fill("Addis Ababa");
  await page.getByPlaceholder("Shipping address").fill("Bole Road");
  await page.getByRole("button", { name: "Place Order" }).click();
  await expect(page).toHaveURL(/\/checkout\/success/);
});

test("shows the branded 404 page", async ({ page }) => {
  await page.goto("/this-page-does-not-exist");
  await expect(page.getByText("Page not found")).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse Shop" })).toBeVisible();
});
