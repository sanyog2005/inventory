export const BRANCHES = ["Gujarat", "Punjab", "Mahipalpur", "Mumbai"];
export const TREATMENTS = ["Methyl Bromide (MB)", "Aluminum Phosphide (ALP)", "Heat Treatment (HT)"];

export const MOCK_STOCK = {
  Gujarat: { MB: 450, ALP: 120, Certificates: 800 },
  Punjab: { MB: 300, ALP: 50, Certificates: 200 },
};

export const MOCK_CERTIFICATES = [
  { id: '095 A', date: '2025-08-26', party: 'KRBL Limited', type: 'ALP', branch: 'Gujarat', status: 'Issued' },
  { id: '043 A', date: '2025-08-20', party: 'Ralington Exports', type: 'MB', branch: 'Punjab', status: 'Pending Invoice' },
];