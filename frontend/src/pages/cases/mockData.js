export const bills = [
  {id:1,regNo:"41021",date:"21/09/2026",time:"08:04 PM",patient:"Mr. Aarav Singh",referredBy:"Dr. City Clinic",total:600,paid:600,discount:0,status:"No due"},
  {id:2,regNo:"41020",date:"21/09/2026",time:"07:57 PM",patient:"Mrs. Meera Sharma",referredBy:"Dr. General Hospital",total:2400,paid:2400,discount:0,status:"No due"},
  {id:3,regNo:"41019",date:"21/09/2026",time:"07:50 PM",patient:"Mr. Kabir Verma",referredBy:"Self",total:2800,paid:1800,discount:0,status:"Due: Rs.1,000"},
  {id:4,regNo:"41018",date:"21/09/2026",time:"07:46 PM",patient:"Ms. Anaya Gupta",referredBy:"Dr. Health Point",total:900,paid:900,discount:0,status:"No due"},
  {id:5,regNo:"41017",date:"21/09/2026",time:"07:16 PM",patient:"Master Vihaan",referredBy:"Dr. City Clinic",total:1500,paid:1500,discount:0,status:"No due"},
  {id:6,regNo:"41016",date:"21/09/2026",time:"07:14 PM",patient:"Mrs. Nisha Patel",referredBy:"Self",total:700,paid:700,discount:0,status:"No due"},
];

export const transactions = [
  {id:"TX-8011",regNo:"#41021",patient:"Aarav Singh",referredBy:"Dr. City Clinic",date:"21/09/2026",time:"08:04 PM",dcn:"L71",cc:"Main",amount:600,method:"cash",receivedBy:"Demo Cashier"},
  {id:"TX-8010",regNo:"#41020",patient:"Meera Sharma",referredBy:"Dr. General Hospital",date:"21/09/2026",time:"07:57 PM",dcn:"L70",cc:"Main",amount:2400,method:"cash",receivedBy:"Demo Cashier"},
  {id:"TX-8009",regNo:"#41019",patient:"Kabir Verma",referredBy:"Self",date:"21/09/2026",time:"07:52 PM",dcn:"L69",cc:"Main",amount:-500,method:"cash",receivedBy:"Demo Cashier"},
  {id:"TX-8008",regNo:"#41018",patient:"Anaya Gupta",referredBy:"Dr. Health Point",date:"21/09/2026",time:"07:46 PM",dcn:"L68",cc:"Main",amount:900,method:"upi",receivedBy:"Demo Cashier"},
  {id:"TX-8007",regNo:"#41017",patient:"Vihaan",referredBy:"Dr. City Clinic",date:"21/09/2026",time:"07:16 PM",dcn:"L67",cc:"Main",amount:1500,method:"card",receivedBy:"Demo Cashier"},
];

export const patients = [
  {id:"P-34091",uhid:"19085",name:"Mr. Aarav Singh (32 YRS/M)",address:"Jhansi",mobile:"98XXXXXX01",registered:"21/09/2026"},
  {id:"P-34090",uhid:"",name:"Mrs. Meera Sharma (45 YRS/F)",address:"Jhansi",mobile:"98XXXXXX02",registered:"21/09/2026"},
  {id:"P-34089",uhid:"19082",name:"Mr. Kabir Verma (28 YRS/M)",address:"Datia",mobile:"98XXXXXX03",registered:"21/09/2026"},
  {id:"P-34088",uhid:"",name:"Ms. Anaya Gupta (24 YRS/F)",address:"Jhansi",mobile:"98XXXXXX04",registered:"21/09/2026"},
  {id:"P-34087",uhid:"19078",name:"Master Vihaan (8 YRS/M)",address:"Jhansi",mobile:"98XXXXXX05",registered:"21/09/2026"},
];

export const agents = [
  {id:"AG-101",name:"Rohit Kumar",registered:"12/08/2026",status:"Active"},
  {id:"AG-102",name:"Neha Singh",registered:"19/08/2026",status:"Active"},
  {id:"AG-103",name:"Amit Verma",registered:"02/09/2026",status:"Archived"},
];

export const referralDoctors = [
  {id:"DR-101",name:"Dr. City Clinic",mobile:"98XXXXXX11",speciality:"General Medicine",cases:28,status:"Active"},
  {id:"DR-102",name:"Dr. Health Point",mobile:"98XXXXXX12",speciality:"Physician",cases:16,status:"Active"},
  {id:"DR-103",name:"Dr. Care Hospital",mobile:"98XXXXXX13",speciality:"Hospital",cases:11,status:"Active"},
];

export const outsourceCases = [
  {id:1,regNo:"40991",date:"20/09/2026",patient:"Mr. Dev Kumar",investigations:"Vitamin D, Vitamin B12",status:"Sent"},
  {id:2,regNo:"40984",date:"20/09/2026",patient:"Mrs. Riya Jain",investigations:"ANA Profile",status:"Pending"},
];

export const ctCases = [
  {id:1,regNo:"40972",date:"20/09/2026",patient:"Mr. Arjun Rai",investigations:"CT Head Plain",status:"Completed"},
  {id:2,regNo:"40968",date:"19/09/2026",patient:"Mrs. Kavya Shah",investigations:"CT Chest",status:"Pending"},
];