export const commonFields = {
  id: {
    type: "string",
    primary: true,
    maxLength: 128,
  },
  createdAt: {
    type: "number",
  },
  updatedAt: {
    type: "number",
  },
  synced: {
    type: "boolean",
    default: false,
  },
  isDeleted: {
    type: "boolean",
    default: false,
  },
};
