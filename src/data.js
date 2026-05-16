// Initial data extracted from the user's provided image

export const categories = [
  { id: 'Company', label: 'Company (Permanent)' },
  { id: 'Vehicle', label: 'Vehicle (Assets)' },
  { id: 'Riders', label: 'Riders (Returnable)' },
  { id: 'Driving School Payment', label: 'Driving School Payment (Returnable)' },
  { id: 'Transportation', label: 'Transportation (Permanent)' },
  { id: 'Others', label: 'Others (Permanent)' }
];

export const expenseTypes = {
  'Company': 'Permanent',
  'Vehicle': 'Assets',
  'Riders': 'Returnable',
  'Driving School Payment': 'Returnable',
  'Transportation': 'Permanent',
  'Others': 'Permanent'
};

// Extracted from image
export const initialTransactions = [
  { id: 'NL-1', date: '31-Jan', description: 'From Boss', debit: 0, credit: 15000, category: 'Funding', type: 'Income' },
  { id: 'NL-2', date: '31-Jan', description: 'From Boss', debit: 0, credit: 10000, category: 'Funding', type: 'Income' },
  { id: 'NL-3', date: '23-Feb', description: 'From Boss', debit: 0, credit: 2000, category: 'Funding', type: 'Income' },
  { id: 'NL-4', date: '22-Mar', description: 'From Boss', debit: 0, credit: 1000, category: 'Funding', type: 'Income' },
  { id: 'NL-5', date: '03-Apr', description: 'From Boss', debit: 0, credit: 5500, category: 'Funding', type: 'Income' },
  { id: 'NL-6', date: '20-Apr', description: 'From Boss', debit: 0, credit: 5000, category: 'Funding', type: 'Income' },
  { id: 'NL-7', date: '20-Apr', description: 'From Boss', debit: 0, credit: 35000, category: 'Funding', type: 'Income' },
  
  { id: 'NL-8', date: '', description: 'ami', debit: 4653, credit: 0, category: 'Others', type: 'Permanent' },
  { id: 'NL-9', date: '', description: 'Driving School Payment', debit: 10000, credit: 0, category: 'Driving School Payment', type: 'Returnable' },
  { id: 'NL-10', date: '31-Jan', description: 'uber for going school', debit: 50, credit: 0, category: 'Transportation', type: 'Permanent' },
  { id: 'NL-11', date: '01-Feb', description: 'Commercial Register renew', debit: 1300, credit: 0, category: 'Company', type: 'Permanent' },
  { id: 'NL-12', date: '02-Feb', description: 'Buy 1 Second hand Bikes', debit: 4800, credit: 0, category: 'Vehicle', type: 'Assets' },
  { id: 'NL-13', date: '03-Feb', description: 'Driving School Payment', debit: 7500, credit: 0, category: 'Driving School Payment', type: 'Returnable' },
  { id: 'NL-14', date: '05-Feb', description: '2 healmet buy new', debit: 200, credit: 0, category: 'Vehicle', type: 'Assets' },
  { id: 'NL-15', date: '05-Feb', description: 'bike master servcies', debit: 485, credit: 0, category: 'Vehicle', type: 'Assets' },
  { id: 'NL-16', date: '03-Feb', description: 'uber for going school', debit: 50, credit: 0, category: 'Transportation', type: 'Permanent' },
  { id: 'NL-17', date: '03-Feb', description: 'uber for going school', debit: 49, credit: 0, category: 'Transportation', type: 'Permanent' },
  { id: 'NL-18', date: '04-Feb', description: 'uber for going school', debit: 41, credit: 0, category: 'Transportation', type: 'Permanent' },
  { id: 'NL-19', date: '04-Feb', description: 'uber for going school', debit: 50, credit: 0, category: 'Transportation', type: 'Permanent' },
  { id: 'NL-20', date: '', description: 'Office rent feb', debit: 800, credit: 0, category: 'Company', type: 'Permanent' },
  { id: 'NL-21', date: '19-Feb', description: 'uber for going school', debit: 43, credit: 0, category: 'Transportation', type: 'Permanent' },
  { id: 'NL-22', date: '19-Feb', description: 'uber for going school', debit: 45, credit: 0, category: 'Transportation', type: 'Permanent' },
  { id: 'NL-23', date: '19-Feb', description: '6 rider reexam book', debit: 300, credit: 0, category: 'Riders', type: 'Returnable' },
  { id: 'NL-24', date: '21-Feb', description: 'uber for going school', debit: 30, credit: 0, category: 'Transportation', type: 'Permanent' },
  { id: 'NL-25', date: '23-Feb', description: 'Salary Transfer 3 month', debit: 570, credit: 0, category: 'Company', type: 'Permanent' },
  { id: 'NL-26', date: '', description: 'Company audit', debit: 800, credit: 0, category: 'Company', type: 'Permanent' },
  { id: 'NL-27', date: '', description: 'office rent mar', debit: 800, credit: 0, category: 'Company', type: 'Permanent' },
  { id: 'NL-28', date: '26-Mar', description: 'uber for going school', debit: 200, credit: 0, category: 'Transportation', type: 'Permanent' },
  { id: 'NL-29', date: '15-Apr', description: 'jahid rider give rent', debit: 100, credit: 0, category: 'Riders', type: 'Returnable' },
  { id: 'NL-30', date: '', description: 'saidur , taslim rider reexam book', debit: 100, credit: 0, category: 'Riders', type: 'Returnable' },
  { id: 'NL-31', date: '', description: 'Jahid rider rent for driving license print', debit: 150, credit: 0, category: 'Riders', type: 'Returnable' },
  { id: 'NL-32', date: '23-Apr', description: 'uber for going school', debit: 35, credit: 0, category: 'Transportation', type: 'Permanent' },
  { id: 'NL-33', date: '23-Apr', description: 'sohag rider rent for go school', debit: 50, credit: 0, category: 'Riders', type: 'Returnable' },
  { id: 'NL-34', date: '23-Apr', description: 'sohag, saidur rider Driving License print', debit: 300, credit: 0, category: 'Riders', type: 'Returnable' },
  { id: 'NL-35', date: '23-Apr', description: 'office rent apr', debit: 800, credit: 0, category: 'Company', type: 'Permanent' },
  { id: 'NL-36', date: '23-Apr', description: 'office door', debit: 120, credit: 0, category: 'Company', type: 'Permanent' },
  { id: 'NL-37', date: '27-Apr', description: 'uber for going school', debit: 72, credit: 0, category: 'Transportation', type: 'Permanent' },
  { id: 'NL-38', date: '27-Apr', description: 'give jahid rider rent', debit: 50, credit: 0, category: 'Riders', type: 'Returnable' },
  { id: 'NL-39', date: '30-Apr', description: 'Naim rider driving license print', debit: 150, credit: 0, category: 'Riders', type: 'Returnable' },
  { id: 'NL-40', date: '29-Apr', description: 'Company Commercial Permit renew', debit: 2200, credit: 0, category: 'Company', type: 'Permanent' },
  { id: 'NL-41', date: '', description: 'Naim rider give rent', debit: 50, credit: 0, category: 'Riders', type: 'Returnable' },
  { id: 'NL-42', date: '11-May', description: 'uber rent for go Fahes bike istimara print', debit: 36, credit: 0, category: 'Transportation', type: 'Permanent' },
  { id: 'NL-43', date: '10-May', description: 'dgmt showroom ruber rent', debit: 36, credit: 0, category: 'Others', type: 'Permanent' },
  { id: 'NL-44', date: '11-May', description: 'truck rent for bike', debit: 100, credit: 0, category: 'Transportation', type: 'Permanent' },
  { id: 'NL-45', date: '', description: 'rasel rider driving license print', debit: 150, credit: 0, category: 'Riders', type: 'Returnable' },
  { id: 'NL-46', date: '', description: '5 bike box stand and phone stand', debit: 540, credit: 0, category: 'Vehicle', type: 'Assets' },
  { id: 'NL-47', date: '', description: 'box rent for bike 2 days', debit: 80, credit: 0, category: 'Vehicle', type: 'Assets' },
  { id: 'NL-48', date: '', description: 'Buy 5 new bikes', debit: 35000, credit: 0, category: 'Vehicle', type: 'Assets' },
  { id: 'NL-49', date: '13-May', description: 'fahes registration 60 riyal 5 bikes', debit: 300, credit: 0, category: 'Vehicle', type: 'Assets' },
  { id: 'NL-50', date: '13-May', description: 'fahas uber rent', debit: 80, credit: 0, category: 'Transportation', type: 'Permanent' },
  { id: 'NL-51', date: '14-May', description: 'fahas uber rent', debit: 40, credit: 0, category: 'Transportation', type: 'Permanent' }
];
