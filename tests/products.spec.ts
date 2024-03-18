import { Locator, Page, expect, test } from "@playwright/test";

class Products {
  public readonly list: Locator;

  constructor(private readonly page: Page) {
    this.list = this.page.getByRole("list", { name: /product list/i });
  }

  async getListItems() {
    // use this after query is finished
    return this.list.getByRole("listitem").all();
  }
}

test.describe("when products load", () => {
  test.beforeEach(async ({ page }) => {
    const responsePromise = page.waitForResponse("/products?limit=10&page=0");
    await page.goto("/");
    await responsePromise; // wait for query to finish
  });

  test("shows 10 products", async ({ page }) => {
    const products = new Products(page);
    const items = await products.getListItems();
    expect(items).toHaveLength(10);
  });
});
