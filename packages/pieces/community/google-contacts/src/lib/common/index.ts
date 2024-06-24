import { ProcessorFn } from '@activepieces/pieces-framework';

export const googleContactsCommon = {
  baseUrl: `https://people.googleapis.com/v1/people`,
};

export const processText: ProcessorFn<any, string> = (property, value) => {
  // If empty string of false, return undefined to avoid updating contact.
  if(value === null || value === undefined || value === false || value === '') {
    return undefined;
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return value.toString();
};
