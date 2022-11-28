module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      url: "https://interface-test.on.fleek.co/",
      settings: {
        onlyCategories: ["seo", "performance", "accessibility"]
      },
      assert: {
        assertions: {
          "categoriesx:performance": ["error", { minScore: 0.1 }],
          "categories:accessibility": ["error", { minScore: 0.1 }],
          "categories:seo": ["error", { minScore: 0.1 }]
        }
      },
      upload: {
        target: "temporary-public-storage"
      }
    }
  }
};
