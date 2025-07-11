export function encodeSgtin96(gtin: string, serial: string) {
  gtin = gtin.padStart(14, "0");
  const gtin13 = gtin.slice(0, 13);
  const companyPrefix = gtin13.slice(1, 8);
  const itemRef = gtin13.slice(8, 14);
  const filter = 1;
  const partition = 5;
  const header = 0x30;
  const companyPrefixNum = BigInt(companyPrefix);
  const itemRefNum = BigInt(itemRef);
  const serialNum = BigInt(serial);
  let bin = BigInt(header) << 88n;
  bin |= BigInt(filter) << 85n;
  bin |= BigInt(partition) << 82n;
  bin |= companyPrefixNum << 58n;
  bin |= itemRefNum << 38n;
  bin |= serialNum; // 38 bits
  return bin.toString(16).toUpperCase().padStart(24, "0");
}
