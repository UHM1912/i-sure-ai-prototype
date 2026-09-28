export type Policy = {
  id: string;
  customer: string;
  type: string;
  premium: number;
  status: "Active" | "Pending" | "Lapsed" | "Under Review";
  updated: string;
};

export const mockPolicies: Policy[] = [
  { id: "LIC-2026-00124", customer: "Rajesh Sharma", type: "Term Life", premium: 24500, status: "Active", updated: "2026-09-21" },
  { id: "LIC-2026-00125", customer: "Priya Verma", type: "Endowment", premium: 41200, status: "Pending", updated: "2026-09-20" },
  { id: "LIC-2026-00126", customer: "Amit Singh", type: "Whole Life", premium: 18900, status: "Active", updated: "2026-09-18" },
  { id: "LIC-2026-00127", customer: "Neha Kapoor", type: "ULIP", premium: 63400, status: "Under Review", updated: "2026-09-17" },
  { id: "LIC-2026-00128", customer: "Rahul Mehta", type: "Term Life", premium: 21750, status: "Active", updated: "2026-09-16" },
  { id: "LIC-2026-00129", customer: "Sneha Iyer", type: "Money Back", premium: 35800, status: "Lapsed", updated: "2026-09-14" },
  { id: "LIC-2026-00130", customer: "Vikram Nair", type: "Term Life", premium: 27300, status: "Active", updated: "2026-09-12" },
  { id: "LIC-2026-00131", customer: "Ananya Bose", type: "Endowment", premium: 48600, status: "Pending", updated: "2026-09-11" },
  { id: "LIC-2026-00132", customer: "Karan Malhotra", type: "ULIP", premium: 72100, status: "Active", updated: "2026-09-09" },
  { id: "LIC-2026-00133", customer: "Divya Menon", type: "Whole Life", premium: 19400, status: "Active", updated: "2026-09-08" },
  { id: "GEN-2026-00982", customer: "Arjun Patel", type: "Motor", premium: 12800, status: "Active", updated: "2026-09-07" },
  { id: "GEN-2026-00983", customer: "Meera Joshi", type: "Health", premium: 31200, status: "Pending", updated: "2026-09-05" },
];

export const recentImports = [
  { file: "life_policy_data.xlsx", records: "1,248", status: "Completed", date: "2026-09-26 11:04" },
  { file: "customer_master.xlsx", records: "3,421", status: "Completed", date: "2026-09-25 16:32" },
  { file: "renewals_q3.csv", records: "842", status: "Completed", date: "2026-09-24 09:12" },
  { file: "claims_backlog.json", records: "196", status: "Partial", date: "2026-09-22 14:48" },
];

export const recentActivity = [
  { title: "Policy data imported", detail: "life_policy_data.xlsx · 1,248 records", time: "12 min ago" },
  { title: "New customer record created", detail: "Neha Kapoor · CUST-40921", time: "48 min ago" },
  { title: "General Insurance data updated", detail: "Motor portfolio · 312 rows", time: "2 hours ago" },
  { title: "Life Insurance record added", detail: "LIC-2026-00133", time: "Yesterday" },
];

export const generalCategories = [
  { name: "Motor Insurance", policies: "4,281", claims: 62, growth: "+4.2%" },
  { name: "Health Insurance", policies: "3,914", claims: 108, growth: "+7.8%" },
  { name: "Property Insurance", policies: "1,506", claims: 21, growth: "+2.1%" },
  { name: "Travel Insurance", policies: "982", claims: 9, growth: "-1.4%" },
];

export const portfolioSeries = [
  { month: "Apr", value: 128 },
  { month: "May", value: 141 },
  { month: "Jun", value: 137 },
  { month: "Jul", value: 158 },
  { month: "Aug", value: 172 },
  { month: "Sep", value: 186 },
];

export const investmentProducts = [
  { name: "Balanced Growth Fund", nav: "₹ 184.22", change: "+1.8%", aum: "₹ 942 Cr" },
  { name: "Secure Income Plan", nav: "₹ 112.04", change: "+0.4%", aum: "₹ 611 Cr" },
  { name: "Equity Advantage", nav: "₹ 276.91", change: "+2.6%", aum: "₹ 1,284 Cr" },
  { name: "Debt Shield", nav: "₹ 98.47", change: "-0.3%", aum: "₹ 428 Cr" },
];

export const investmentTransactions = [
  { id: "TXN-77121", customer: "Rajesh Sharma", product: "Equity Advantage", amount: "₹ 1,20,000", date: "2026-09-26" },
  { id: "TXN-77122", customer: "Priya Verma", product: "Secure Income Plan", amount: "₹ 45,000", date: "2026-09-25" },
  { id: "TXN-77123", customer: "Vikram Nair", product: "Balanced Growth Fund", amount: "₹ 2,10,000", date: "2026-09-24" },
  { id: "TXN-77124", customer: "Divya Menon", product: "Debt Shield", amount: "₹ 78,500", date: "2026-09-23" },
];
