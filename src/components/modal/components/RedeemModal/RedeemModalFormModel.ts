export const FormModel = {
  formFields: {
    name: {
      name: "name",
      requiredErrorMessage: "This field is required",
      placeholder: "Name"
    },
    streetNameAndNumber: {
      name: "streetNameAndNumber",
      requiredErrorMessage: "This field is required",
      placeholder: "Street Name and Number"
    },
    city: {
      name: "city",
      requiredErrorMessage: "This field is required",
      placeholder: "City"
    },
    state: {
      name: "state",
      requiredErrorMessage: "This field is required",
      placeholder: "State"
    },
    zip: {
      name: "zip",
      requiredErrorMessage: "This field is required",
      placeholder: "ZIP"
    },
    country: {
      name: "country",
      requiredErrorMessage: "This field is required",
      placeholder: "Country"
    },
    email: {
      name: "email",
      requiredErrorMessage: "This field is required",
      placeholder: "Email",
      mustBeEmail: "This is not an e-mail"
    },
    phone: {
      name: "phone",
      requiredErrorMessage: "This field is required",
      placeholder: "Phone Number"
    }
  }
} as const;
