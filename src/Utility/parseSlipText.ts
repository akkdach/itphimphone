
export interface SlipData {
  amount: string | null;
  referenceCode: string | null;
  senderName: string | null;
  receiverName: string | null;
  receiverAccount: string | null;
}

export const parseSlipText = (ocrText: string): SlipData => {
  const amountMatch = ocrText.match(/จํานวน[:\s]+([\d.,]+)/);
  const referenceMatch = ocrText.match(/เลขที่รายการ[:\s]+([A-Z0-9]+)/);
//   const accountMatches = [...ocrText.matchAll(/XXX-X-X(\d+)-X/g)];
  const nameMatches = ocrText.split("\n").filter(line => line.trim() && !line.includes("XXX") && !line.includes("ธ.") && !line.includes("บาท"));

  return {
    amount: amountMatch ? amountMatch[1] : null,
    referenceCode: referenceMatch ? referenceMatch[1] : null,
    senderName: nameMatches.length > 0 ? nameMatches[0].trim() : null,
    receiverName: nameMatches.length > 1 ? nameMatches[1].trim() : null,
    receiverAccount: ""// accountMatches.length > 1 ? accountMatches[1][1] : null,
  };
};
