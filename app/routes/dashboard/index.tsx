import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { CalendarDateRangePicker } from "~/features/dashboard/components/date-range-picker";
import { Overview } from "~/features/dashboard/components/overview";
import { RecentSales } from "~/features/dashboard/components/recent-sales";
import type { Route } from "./+types";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button as ShadcnButton } from "~/components/ui/button";
import { encodeSgtin96 } from "~/utils/logic/sgtinGenerator";
import { Loader2, Copy as CopyIcon, Check as CheckIcon } from "lucide-react";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Generator" }];
};

type FormValues = {
  styleNumber: string;
  size: string;
  itemName: string;
  color: string;
  itemCode: string;
  lastSerial: string;
  firstSgtin: string;
  qtyToGenerate: number;
};

const defaultValues: FormValues = {
  styleNumber: "",
  size: "",
  itemName: "",
  color: "",
  itemCode: "",
  lastSerial: "9000",
  firstSgtin: "",
  qtyToGenerate: 1,
};

function Page() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const [generatedRows, setGeneratedRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Watch itemCode and lastSerial
  const itemCode = watch("itemCode");
  const lastSerial = watch("lastSerial");

  useEffect(() => {
    // Only run if both fields are filled
    if (itemCode && lastSerial) {
      // SGTIN-96 encoding logic
      // Example: itemCode '5057877131530', lastSerial '9000' => '303534B5540CD84000002329'
      function encodeSgtin96(gtin: string, serial: string) {
        // SGTIN-96 encoding for 7-digit company prefix (partition 5)
        gtin = gtin.padStart(14, "0");
        // Remove check digit (last digit)
        const gtin13 = gtin.slice(0, 13);
        // Company prefix: 7 digits after indicator
        const companyPrefix = gtin13.slice(1, 8);
        // Item reference: next 6 digits after company prefix
        const itemRef = gtin13.slice(8, 14);
        // Partition: 5 (7-digit company prefix)
        const filter = 1; // POS item
        const partition = 5;
        // Convert to binary fields
        const header = 0x30; // 8 bits
        const companyPrefixNum = BigInt(companyPrefix);
        const itemRefNum = BigInt(itemRef);
        const serialNum = BigInt(serial) + 1n;
        // Build the 96 bits (partition 5: companyPrefix 24 bits, itemRef 20 bits)
        let bin = BigInt(header) << 88n; // 8 bits
        bin |= BigInt(filter) << 85n; // 3 bits
        bin |= BigInt(partition) << 82n; // 3 bits
        bin |= companyPrefixNum << 58n; // 24 bits
        bin |= itemRefNum << 38n; // 20 bits
        bin |= serialNum; // 38 bits
        // Convert to 24 hex chars
        return bin.toString(16).toUpperCase().padStart(24, "0");
      }
      const sgtin = encodeSgtin96(itemCode, lastSerial);
      setValue("firstSgtin", sgtin);
    } else {
      setValue("firstSgtin", "");
    }
  }, [itemCode, lastSerial, setValue]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    // Simulate async work for UX (remove setTimeout in production)
    await new Promise((res) => setTimeout(res, 500));
    const rows = [];
    const startSerial = parseInt(data.lastSerial, 10) + 1;
    for (let i = 0; i < data.qtyToGenerate; i++) {
      const serial = startSerial + i;
      const sgtin = encodeSgtin96(data.itemCode, serial.toString());
      rows.push({
        styleNumber: data.styleNumber,
        itemName: data.itemName ? data.itemName : "-",
        color: data.color ? data.color : "-",
        size: data.size,
        itemCode: data.itemCode,
        serial: serial,
        sgtin,
      });
    }
    setGeneratedRows(rows);
    setIsLoading(false);
  };

  // Copy table to clipboard as tab-separated values
  const handleCopyTable = () => {
    if (generatedRows.length === 0) return;
    const header = [
      "Style Number",
      "Item Name",
      "Color",
      "Size",
      "Item Code",
      "Serial",
      "SGTIN-96 Hex (EPC Memory Bank Contents)",
    ];
    const rows = generatedRows.map((row) => [
      row.styleNumber,
      row.itemName,
      row.color,
      row.size,
      row.itemCode,
      row.serial,
      row.sgtin,
    ]);
    const tsv = [header, ...rows].map((r) => r.join("\t")).join("\n");
    navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleReset = () => {
    reset(defaultValues);
    setGeneratedRows([]);
    setCopied(false);
  };

  const handleSelectAll = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-0">
      <h2 className="text-3xl font-bold tracking-tight">Generator</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
          <div className="flex-1 space-y-4 p-4 pt-0">
            <div className="flex w-full max-w-sm items-center justify-between gap-7">
              <Label htmlFor="style-number" className="whitespace-nowrap">
                Style Number
              </Label>
              <Input
                type="text"
                id="style-number"
                placeholder="Style"
                className="max-w-[250px]"
                {...register("styleNumber")}
                onFocus={handleSelectAll}
              />
            </div>
            <div className="flex w-full max-w-sm items-center justify-between gap-7">
              <Label htmlFor="size" className="whitespace-nowrap">
                Size
              </Label>
              <Input
                type="text"
                id="size"
                placeholder="Size"
                className="max-w-[250px]"
                {...register("size")}
                onFocus={handleSelectAll}
              />
            </div>
            <div className="flex w-full max-w-sm items-center justify-between gap-7">
              <Label htmlFor="item-name" className="whitespace-nowrap">
                Item Name
              </Label>
              <Input
                type="text"
                id="item-name"
                placeholder="Item Name"
                className="max-w-[250px]"
                {...register("itemName")}
                onFocus={handleSelectAll}
              />
            </div>
            <div className="flex w-full max-w-sm items-center justify-between gap-7">
              <Label htmlFor="color" className="whitespace-nowrap">
                Color
              </Label>
              <Input
                type="text"
                id="color"
                placeholder="Color"
                className="max-w-[250px]"
                {...register("color")}
                onFocus={handleSelectAll}
              />
            </div>
          </div>
          <div className="flex-1 space-y-4 p-4 pt-0">
            <div className="flex w-full max-w-sm items-center justify-between gap-7">
              <Label htmlFor="item-code" className="whitespace-nowrap">
                Item Code
              </Label>
              <Input
                type="text"
                id="item-code"
                placeholder="Item Code"
                className="max-w-[250px]"
                {...register("itemCode")}
                onFocus={handleSelectAll}
              />
            </div>
            <div className="flex w-full max-w-sm items-center justify-between gap-7">
              <Label htmlFor="last-serial" className="whitespace-nowrap">
                Last Serial
              </Label>
              <Input
                type="text"
                id="last-serial"
                placeholder="Last Serial"
                className="max-w-[250px]"
                {...register("lastSerial")}
                onFocus={handleSelectAll}
              />
            </div>
            <div className="flex w-full max-w-sm items-center justify-between gap-7">
              <Label htmlFor="first-sgtin" className="whitespace-nowrap">
                First SGTIN-96
              </Label>
              <Input
                type="text"
                id="first-sgtin"
                placeholder="First SGTIN-96"
                className="max-w-[250px] cursor-text"
                disabled={true}
                style={{ cursor: "text" }}
                {...register("firstSgtin")}
                onFocus={handleSelectAll}
              />
            </div>
            <div className="flex w-full max-w-sm items-center justify-between gap-7">
              <Label htmlFor="qty-to-generate" className="whitespace-nowrap">
                Qty to Generate
              </Label>
              <Input
                type="number"
                id="qty-to-generate"
                placeholder="Qty to Generate"
                className="max-w-[250px]"
                {...register("qtyToGenerate", { valueAsNumber: true })}
                onFocus={handleSelectAll}
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start space-y-4 p-4 pt-0">
            <Button
              className="w-full max-w-sm transition active:scale-95 duration-100 flex items-center justify-center"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>
            <Button
              className="w-full max-w-sm transition active:scale-95 duration-100"
              type="button"
              onClick={handleReset}
              variant="secondary"
              disabled={isLoading}
            >
              Reset
            </Button>
          </div>
        </div>
      </form>
      {generatedRows.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Generated SGTIN Table</h3>
            <ShadcnButton
              type="button"
              onClick={handleCopyTable}
              variant="outline"
              className="transition active:scale-95 duration-100 flex items-center gap-2"
              disabled={isLoading}
            >
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4 text-green-600 transition-all duration-200 scale-110" />
                  Copied!
                </>
              ) : (
                <>
                  <CopyIcon className="h-4 w-4 transition-all duration-200" />
                  Copy Table
                </>
              )}
            </ShadcnButton>
          </div>
          <Table>
            <TableCaption>
              SGTIN-96 Hex (EPC Memory Bank Contents) for generated serials.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Style Number</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Item Code</TableHead>
                <TableHead>Serial</TableHead>
                <TableHead>SGTIN-96 Hex (EPC Memory Bank Contents)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {generatedRows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.styleNumber}</TableCell>
                  <TableCell>{row.itemName}</TableCell>
                  <TableCell>{row.color}</TableCell>
                  <TableCell>{row.size}</TableCell>
                  <TableCell>{row.itemCode}</TableCell>
                  <TableCell>{row.serial}</TableCell>
                  <TableCell className="font-mono">{row.sgtin}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-2 text-sm text-muted-foreground">
            <span>
              After pasting into Google Sheets, select the table and set font to
              Calibri, size 16, bold the header, and add 1px black borders for
              best results.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
