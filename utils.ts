
export const toBurmese = (num: number | string | undefined | null): string => {
  if (num === null || num === undefined) return '';
  const str = num.toString();
  const english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const burmese = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
  
  return str.split('').map(char => {
    const index = english.indexOf(char);
    return index !== -1 ? burmese[index] : char;
  }).join('');
};

export const fromBurmese = (str: string): number => {
  if (!str) return 0;
  const burmese = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
  const english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  let normalized = str.toString();
  // Replace Burmese digits with English
  burmese.forEach((char, index) => {
    normalized = normalized.split(char).join(english[index]);
  });
  
  // Remove commas and any other non-numeric characters except period
  normalized = normalized.replace(/,/g, '').replace(/[^0-9.]/g, '');
  
  const result = parseFloat(normalized);
  return isNaN(result) ? 0 : result;
};
