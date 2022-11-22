module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      url: "https://interface-test.on.fleek.co/",
      settings: {
        onlyCategories: ["seo", "performance"],
        verbose: true,
        maxWaiForLoad: 50000
      },
      assert: {
        assertions: {
          "categories:performance": ["warn", { minScore: 0.1 }],
          "categories:accessibility": ["warn", { minScore: 0.1 }],
          "categories:seo": ["warn", { minScore: 0.1 }]
        }
      },
      upload: {
        target: "temporary-public-storage"
      }
    }
  }
};
