export const FormModel = {
  formFields: {
    description: {
      name: "description",
      requiredErrorMessage: "This field is required"
    },
    proposalsTypes: {
      name: "proposalsTypes"
    },
    escrow: {
      name: "escrow"
    },
    refundAmount: {
      name: "refundAmount"
    },
    refundPercentage: {
      name: "refundPercentage",
      moreThanErrorMessage: "The percentage should be more than 0",
      maxErrorMessage: "The percentage should be less than or equal to 100",
      emptyErrorMessage: "This field cannot be left empty"
    },
    upload: {
      name: "upload"
    }
  }
} as const;
