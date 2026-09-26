export const reportRows=[
{id:1,reg:"#41025",caseNo:"L82",time:"09:49 PM",patient:"Mr. Raj Malhotra",age:"26 YRS/M",referrer:"Dr. SELF",tests:"Complete Blood Count (CBC)",cc:"Main",status:"Signed off"},
{id:2,reg:"#41024",caseNo:"L81",time:"09:41 PM",patient:"Mrs. Kavya Singh",age:"44 YRS/F",referrer:"Dr. City Hospital",tests:"CRP (Quantitative), ESR (Westergren), CBC",cc:"Main",status:"Signed off"},
{id:3,reg:"#41023",caseNo:"L80",time:"09:40 PM",patient:"Mrs. Naina Verma",age:"33 YRS/F",referrer:"Dr. Health Point",tests:"Complete Blood Count (CBC), Liver Function Test (LFT)",cc:"Main",status:"New"},
{id:4,reg:"#41022",caseNo:"L79",time:"09:37 PM",patient:"Mrs. Meera Devi",age:"42 YRS/F",referrer:"Dr. Health Point",tests:"Complete Blood Count (CBC), Liver Function Test (LFT)",cc:"Main",status:"Signed off"},
{id:5,reg:"#41021",caseNo:"L78",time:"09:34 PM",patient:"Mr. Arjun Yadav",age:"32 YRS/M",referrer:"Dr. Care Clinic",tests:"Urine Routine Examination, CRP (Quantitative)",cc:"Main",status:"Signed off"}
];
export const categories=["Haematology","Biochemistry","Serology & Immunology","Clinical Pathology","Cytology","Microbiology","Endocrinology","Histopathology","Others","Miscellaneous"];
export const tests=[
{id:1,name:"Hemoglobin",type:"Single parameter",short:"Hb",category:"Haematology"},
{id:2,name:"Total Leukocyte Count",type:"Single parameter",short:"TLC",category:"Haematology"},
{id:3,name:"Differential Leukocyte Count",type:"Multi parameter",short:"DLC",category:"Haematology"},
{id:4,name:"Erythrocyte sedimentation rate (Westergren)",type:"Single parameter",short:"ESR (Westergren)",category:"Haematology"},
{id:5,name:"Platelet Count",type:"Single parameter",short:"PC",category:"Haematology"},
{id:6,name:"Blood Group & Rh.",type:"Multi parameter",short:"",category:"Haematology"},
{id:7,name:"Liver Function Test",type:"Multi parameter",short:"LFT",category:"Biochemistry"},
{id:8,name:"Kidney Function Test",type:"Multi parameter",short:"KFT",category:"Biochemistry"},
{id:9,name:"C-Reactive Protein",type:"Single parameter",short:"CRP",category:"Serology & Immunology"},
{id:10,name:"Urine Routine Examination",type:"Multi parameter",short:"Urine R/M",category:"Clinical Pathology"}
];
export const packages=[
{id:1,name:"CBC with GBP",fee:100,gender:"Both",included:"Peripheral Blood Smear, Complete Blood Count (CBC)",ratelist:true},
{id:2,name:"Cardiac package",fee:100,gender:"Both",included:"CK-MB, Myoglobin, High-Sensitivity C-Reactive Protein",ratelist:true},
{id:3,name:"Diabetic package",fee:100,gender:"Both",included:"Urine Routine Examination, Serum Uric Acid, Serum Urea",ratelist:true},
{id:4,name:"Fever package",fee:100,gender:"Both",included:"Urine Routine Examination, Typhidot Antibodies, Malaria",ratelist:true},
{id:5,name:"Fitness Package",fee:100,gender:"Both",included:"Vitamin B12, Urine Routine Examination, Random Blood Sugar",ratelist:true},
{id:6,name:"Full body checkup (Female)",fee:2499,gender:"Female",included:"CBC, CRP, Thyroid Profile, Liver Function Test",ratelist:true},
{id:7,name:"Full body checkup (Male)",fee:4899,gender:"Male",included:"CBC, CRP, Testosterone, Kidney Function Test",ratelist:true},
{id:8,name:"Thyroid package",fee:800,gender:"Both",included:"FT3, FT4, TSH",ratelist:false}
];
export const panels=[
{id:1,name:"Complete Blood Count (CBC)",fee:350,category:"Haematology",tests:"Hemoglobin, TLC, DLC, Platelet Count",active:true},
{id:2,name:"Liver Function Test (LFT)",fee:650,category:"Biochemistry",tests:"Bilirubin, SGOT, SGPT, ALP, Protein",active:true},
{id:3,name:"Kidney Function Test (KFT)",fee:600,category:"Biochemistry",tests:"Urea, Creatinine, Uric Acid, Electrolytes",active:true},
{id:4,name:"Lipid Profile",fee:700,category:"Biochemistry",tests:"Cholesterol, Triglycerides, HDL, LDL",active:false}
];
export const interpretations=[
{id:1,name:"25 Hydroxy (OH) Vitamin D",text:"Physiological Basis:",kind:"Test"},
{id:2,name:"Absolute Eosinophil Count",text:"Physiological basis",kind:"Test"},
{id:3,name:"Acid - Fast Bacilli",text:"Note:",kind:"Test"},
{id:4,name:"Activated partial thromboplastin time, APTT",text:"Physiological basis",kind:"Test"},
{id:5,name:"Alfa Fetoprotein, AFP",text:"Alpha-fetoprotein (AFP) is a protein used in clinical interpretation with the reported result.",kind:"Test"},
{id:6,name:"CBC",text:"Peripheral smear and blood count interpretation.",kind:"Panel"},
{id:7,name:"Liver Function Test",text:"Interpret results with clinical findings and reference ranges.",kind:"Panel"}
];
export const counts=[
{id:1,name:"Complete Blood Count (CBC)",count:58},{id:2,name:"Liver Function Test (LFT)",count:29},{id:3,name:"KFT without eGFR",count:27},{id:4,name:"MP (Microscopic)",count:25},{id:5,name:"CRP (Quantitative)",count:25},{id:6,name:"Widal (Tube Method)",count:22},{id:7,name:"CBC with ESR",count:16},{id:8,name:"HIV (Card Test)",count:11},{id:9,name:"PT/INR",count:9},{id:10,name:"HBsAg",count:9},{id:11,name:"HCV",count:9},{id:12,name:"Bilirubin Total, Direct & Indirect",count:7}
];
