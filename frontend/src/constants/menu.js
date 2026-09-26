export const MENU=[
{label:'Dashboard',path:'/dashboard'},
{label:'Business',children:[['Daily business','/business/daily'],['Expenses','/business/expenses'],['Due reports','/business/due-reports'],['Activities','/business/activities'],['Referral business','/business/referral'],['Case wise report','/business/case-wise'],['Business analysis','/business/analysis'],['Data export','/business/export']]},
{label:'Cases',children:[['Bills','/cases/bills'],['Outsource cases','/cases/outsource'],['CT scan cases','/cases/ct-scan'],['Patients','/cases/patients'],['Transactions','/cases/transactions'],['Referral Doctors','/cases/referral-doctors']]},
{label:'Lab',children:[["Today's reports",'/lab/today'],['Search reports','/lab/search'],['Test packages','/lab/packages'],['Test panels','/lab/panels'],['Test categories','/lab/categories'],['Test database','/lab/tests'],['Interpretations','/lab/interpretations'],['Test counts','/lab/counts']]},
{label:'USG',children:[["Today's cases",'/usg/today'],['Search cases','/usg/search'],['Report templates','/usg/templates'],['Signatures','/usg/signatures']]},
{label:'Digital X-ray',children:[["Today's cases",'/xray/today'],['Search cases','/xray/search'],['Report templates','/xray/templates'],['Signatures','/xray/signatures']]},
{label:'Manage',children:[['Browser security','/manage/browser-security'],['Employee login','/manage/employees'],['Doctor access','/manage/doctor-access']]}
];