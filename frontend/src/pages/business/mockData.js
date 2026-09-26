export const dueRows = [
  {
    id: 1,
    reg: "37431",
    date: "12/09/2026\n02:56 PM",
    patient: "Master Aarav",
    ref: "Dr. City Hospital",
    total: "Rs.1,500",
    paid: "Rs.0",
    discount: "Rs.0",
    status: "Due: Rs.1,500",
  },
  {
    id: 2,
    reg: "37220",
    date: "10/09/2026\n02:26 PM",
    patient: "Master Vivaan",
    ref: "Dr. General Hospital",
    total: "Rs.1,100",
    paid: "Rs.0",
    discount: "Rs.0",
    status: "Due: Rs.1,100",
  },
  {
    id: 3,
    reg: "36961",
    date: "08/09/2026\n12:24 AM",
    patient: "Mr. Kabir",
    ref: "Dr. City Hospital",
    total: "Rs.8,800",
    paid: "Rs.0",
    discount: "Rs.0",
    status: "Due: Rs.8,800",
  },
  {
    id: 4,
    reg: "35903",
    date: "25/08/2026\n01:26 PM",
    patient: "Mr. Hemant Kumar",
    ref: "Dr. Multi Care",
    total: "Rs.2,100",
    paid: "Rs.0",
    discount: "Rs.0",
    status: "Due: Rs.2,100",
  },
];
export const txRows = Array.from({ length: 12 }, (_, i) => ({
  id: 4078400 - i,
  reg: "#" + (38183 - i),
  patient: ["Aman Singh", "Sweety", "Munno", "Poonam", "Premwati"][i % 5],
  ref: ["Dr. Hospital", "Dr. Medical", "Dr. Pawan"][i % 3],
  date: "20/09/2026",
  time: `${12 - Math.floor(i / 3)}:${String(35 - i * 2).padStart(2, "0")} ${i < 7 ? "PM" : "AM"}`,
  dcn: "L" + (20 - i),
  cc: "Main",
  amount:
    (i === 9 ? "- " : "+ ") +
    "Rs." +
    [2000, 1500, 1500, 200, 800, 300, 300, 3200, 1000, 300, 700, 1000][i],
  method: "cash",
  received: "Demo Lab Owner",
}));
export const referralRows = [
  "City Hospital",
  "Dr. Avi Sharma",
  "Multi Speciality Hospital",
  "Dr. Diwakar",
  "General Hospital",
  "Dr. Mahendra Singh",
  "Dr. Medical",
  "New City Hospital",
  "Dr. Pawan",
  "Dr. P. Verma",
  "Dr. Raghav",
  "Self",
].map((name, i) => ({
  id: i + 1,
  refId: [188, 101, 2, 74, 187, 94, 197, 322, 41, 5, 90, 1][i],
  name,
  contact: i % 4 === 1 ? "9876543210" : "—",
  cases: [9084, 15, 8094, 610, 1319, 1044, 63, 200, 1423, 1972, 74, 637][i],
  filter: `Today - (${(i % 6) + 1})`,
}));
export const monthly = Array.from({ length: 20 }, (_, i) => {
  const cash = [
    129700, 90200, 118500, 95400, 92250, 137050, 152200, 149900, 146250, 109700,
    138400, 111400, 114900, 107100, 133700, 130000, 129700, 141000, 143100,
    113400,
  ][i];
  return {
    id: i + 1,
    day: String(i + 1).padStart(2, "0") + "-09-2026",
    upi: "0",
    cash: cash.toLocaleString("en-IN"),
    card: "0",
    insurance: "0",
    total: cash.toLocaleString("en-IN"),
  };
});
