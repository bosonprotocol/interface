import { expect, Page, test } from "@playwright/test";

test.describe("Landing page", () => {
  test.beforeEach(async ({ page }) => {
    await offersApi(page);
    await page.goto("/");
  });
  test("should have a h1 Boson dApp", async ({ page }) => {
    const h1 = await page.locator("h1");

    await expect(h1).toHaveText("Boson dApp");
  });
  test("should display the first 10 offers", async ({ page }) => {
    const offers = await page.locator("[data-testid=offer]");

    for (let i = 0; i < 10; i++) {
      const offer = offers.nth(i);
      const title = await offer.locator("[data-testid=title]");
      await expect(title).toHaveText(allOffers[i].metadata?.title || "");
    }
  });
});

const allOffers = [
  {
    id: "0",
    price: "1",
    seller: {
      id: "0x57fafe1fb7c682216fce44e50946c5249192b9d5",
      address: "0x57fafe1fb7c682216fce44e50946c5249192b9d5"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "first offer",
      description: "Description",
      additionalProperties: null
    }
  },
  {
    id: "1",
    price: "1",
    seller: {
      id: "0x0000000000000000000000000000000000000000",
      address: "0x0000000000000000000000000000000000000000"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "offer with id 1",
      description: "Description",
      additionalProperties: null
    }
  },
  {
    id: "10",
    price: "1",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "offer with id 10",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "11",
    price: "1",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "offer with id 11",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "12",
    price: "1",
    seller: {
      id: "0x57fafe1fb7c682216fce44e50946c5249192b9d5",
      address: "0x57fafe1fb7c682216fce44e50946c5249192b9d5"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "offer with id 12",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "13",
    price: "1",
    seller: {
      id: "0xd8bb0e340f1cb59909a4fb9de585cb203be37b8a",
      address: "0xd8bb0e340f1cb59909a4fb9de585cb203be37b8a"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "offer with id 13",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "14",
    price: "1",
    seller: {
      id: "0xd8bb0e340f1cb59909a4fb9de585cb203be37b8a",
      address: "0xd8bb0e340f1cb59909a4fb9de585cb203be37b8a"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "offer with id 14",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "15",
    price: "100000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "offer with id 15",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "16",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "offer with id 16",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "17",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "offer with id 17"
    }
  },
  {
    id: "18",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "19",
    price: "1000000000000000000",
    seller: {
      id: "0x57fafe1fb7c682216fce44e50946c5249192b9d5",
      address: "0x57fafe1fb7c682216fce44e50946c5249192b9d5"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "2",
    price: "1",
    seller: {
      id: "0xd8bb0e340f1cb59909a4fb9de585cb203be37b8a",
      address: "0xd8bb0e340f1cb59909a4fb9de585cb203be37b8a"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "20",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "21",
    price: "1000000000000000000",
    seller: {
      id: "0x57fafe1fb7c682216fce44e50946c5249192b9d5",
      address: "0x57fafe1fb7c682216fce44e50946c5249192b9d5"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "22",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "23",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "24",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "DF Test #1",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "25",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "DF Test #1",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "26",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "LL jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "27",
    price: "1000000000000000000",
    seller: {
      id: "0x5ffe79f68aa11fff056288132fb14e8e616e502a",
      address: "0x5ffe79f68aa11fff056288132fb14e8e616e502a"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "28",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "29",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "3",
    price: "1",
    seller: {
      id: "0xd8bb0e340f1cb59909a4fb9de585cb203be37b8a",
      address: "0xd8bb0e340f1cb59909a4fb9de585cb203be37b8a"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "30",
    price: "1000000000000000000",
    seller: {
      id: "0x4fdbcd12fcf8485f2a9f2643599b1f25db841829",
      address: "0x4fdbcd12fcf8485f2a9f2643599b1f25db841829"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "31",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "32",
    price: "1000000000000000000",
    seller: {
      id: "0x57fafe1fb7c682216fce44e50946c5249192b9d5",
      address: "0x57fafe1fb7c682216fce44e50946c5249192b9d5"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "33",
    price: "1000000000000000000",
    seller: {
      id: "0x5ffe79f68aa11fff056288132fb14e8e616e502a",
      address: "0x5ffe79f68aa11fff056288132fb14e8e616e502a"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "34",
    price: "1000000000000000000",
    seller: {
      id: "0x5ffe79f68aa11fff056288132fb14e8e616e502a",
      address: "0x5ffe79f68aa11fff056288132fb14e8e616e502a"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "35",
    price: "1000000000000000000",
    seller: {
      id: "0x5ffe79f68aa11fff056288132fb14e8e616e502a",
      address: "0x5ffe79f68aa11fff056288132fb14e8e616e502a"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "36",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "37",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "38",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "39",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "4",
    price: "1",
    seller: {
      id: "0xd8bb0e340f1cb59909a4fb9de585cb203be37b8a",
      address: "0xd8bb0e340f1cb59909a4fb9de585cb203be37b8a"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "40",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "41",
    price: "1000000000000000000",
    seller: {
      id: "0x57fafe1fb7c682216fce44e50946c5249192b9d5",
      address: "0x57fafe1fb7c682216fce44e50946c5249192b9d5"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: "QmfMfXquxZeAEGwRGYua5DB1n5FBSs3xTaovXLG4ygZ9Bc"
    }
  },
  {
    id: "42",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: "QmfMfXquxZeAEGwRGYua5DB1n5FBSs3xTaovXLG4ygZ9Bc"
    }
  },
  {
    id: "43",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: "Qma8MwUWCghanpiSDTmJsBwLXjQaxbyX5EWuWvc5UQ4Bgd"
    }
  },
  {
    id: "44",
    price: "1000000000000000000",
    seller: {
      id: "0xaa430778ef57df3a0c3933fba8d525f05e14a587",
      address: "0xaa430778ef57df3a0c3933fba8d525f05e14a587"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: "QmfMfXquxZeAEGwRGYua5DB1n5FBSs3xTaovXLG4ygZ9Bc"
    }
  },
  {
    id: "45",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "DAI"
    },
    metadata: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: "QmfMfXquxZeAEGwRGYua5DB1n5FBSs3xTaovXLG4ygZ9Bc"
    }
  },
  {
    id: "46",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: "QmfMfXquxZeAEGwRGYua5DB1n5FBSs3xTaovXLG4ygZ9Bc"
    }
  },
  {
    id: "47",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: "QmfMfXquxZeAEGwRGYua5DB1n5FBSs3xTaovXLG4ygZ9Bc"
    }
  },
  {
    id: "48",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: "QmfMfXquxZeAEGwRGYua5DB1n5FBSs3xTaovXLG4ygZ9Bc"
    }
  },
  {
    id: "49",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: "QmfMfXquxZeAEGwRGYua5DB1n5FBSs3xTaovXLG4ygZ9Bc"
    }
  },
  {
    id: "5",
    price: "1",
    seller: {
      id: "0xd8bb0e340f1cb59909a4fb9de585cb203be37b8a",
      address: "0xd8bb0e340f1cb59909a4fb9de585cb203be37b8a"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "50",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: "QmfMfXquxZeAEGwRGYua5DB1n5FBSs3xTaovXLG4ygZ9Bc"
    }
  },
  {
    id: "51",
    price: "1000000000000000000",
    seller: {
      id: "0x916431a096865d0f5bab11d2a3258b6af3ba9791",
      address: "0x916431a096865d0f5bab11d2a3258b6af3ba9791"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: "QmfMfXquxZeAEGwRGYua5DB1n5FBSs3xTaovXLG4ygZ9Bc"
    }
  },
  {
    id: "52",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Test Product",
      description: "This is an offer description.",
      additionalProperties: "QmZKZu8Ptwtn9DDhC2MQ66Yx7tcRUvX39dyx9Dvt7GU3gZ"
    }
  },
  {
    id: "53",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: "QmfMfXquxZeAEGwRGYua5DB1n5FBSs3xTaovXLG4ygZ9Bc"
    }
  },
  {
    id: "54",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: "QmfMfXquxZeAEGwRGYua5DB1n5FBSs3xTaovXLG4ygZ9Bc"
    }
  },
  {
    id: "55",
    price: "1000000000000000000",
    seller: {
      id: "0xd8bb0e340f1cb59909a4fb9de585cb203be37b8a",
      address: "0xd8bb0e340f1cb59909a4fb9de585cb203be37b8a"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: "QmfMfXquxZeAEGwRGYua5DB1n5FBSs3xTaovXLG4ygZ9Bc"
    }
  },
  {
    id: "56",
    price: "1000000000000000000",
    seller: {
      id: "0x00c5d17c55940783961352e6f83ea18167841bca",
      address: "0x00c5d17c55940783961352e6f83ea18167841bca"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: "QmfMfXquxZeAEGwRGYua5DB1n5FBSs3xTaovXLG4ygZ9Bc"
    }
  },
  {
    id: "57",
    price: "1000000000000000000",
    seller: {
      id: "0x00c5d17c55940783961352e6f83ea18167841bca",
      address: "0x00c5d17c55940783961352e6f83ea18167841bca"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "t-shirt",
      description: "Really cool tshirt",
      additionalProperties: "QmToHKh2YcV8MfYY18onjnpwsMns7fs84W9UmxvL24sQkB"
    }
  },
  {
    id: "58",
    price: "1000000000000000000",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: "QmfMfXquxZeAEGwRGYua5DB1n5FBSs3xTaovXLG4ygZ9Bc"
    }
  },
  {
    id: "59",
    price: "1000000000000000000",
    seller: {
      id: "0x00c5d17c55940783961352e6f83ea18167841bca",
      address: "0x00c5d17c55940783961352e6f83ea18167841bca"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: "QmfMfXquxZeAEGwRGYua5DB1n5FBSs3xTaovXLG4ygZ9Bc"
    }
  },
  {
    id: "6",
    price: "1",
    seller: {
      id: "0x6967d7acd1ec5f210e9590666498e0cc5d13a843",
      address: "0x6967d7acd1ec5f210e9590666498e0cc5d13a843"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "60",
    price: "1000000000000000000",
    seller: {
      id: "0x9c2925a41d6fb1c6c8f53351634446b0b2e65ee8",
      address: "0x9c2925a41d6fb1c6c8f53351634446b0b2e65ee8"
    },
    exchangeToken: {
      symbol: "BOSON"
    },
    metadata: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: "QmfMfXquxZeAEGwRGYua5DB1n5FBSs3xTaovXLG4ygZ9Bc"
    }
  },
  {
    id: "7",
    price: "1",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "8",
    price: "1",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  },
  {
    id: "9",
    price: "1",
    seller: {
      id: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      title: "Baggy jeans",
      description: "",
      additionalProperties: null
    }
  }
];

const offersApi = (page: Page) =>
  page.route(
    "**//api.thegraph.com/subgraphs/name/dohaki/bosonccropsten",
    (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          data: {
            offers: allOffers
          }
        })
      });
    }
  );
