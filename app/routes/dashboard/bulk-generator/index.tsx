import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Loader2, Copy as CopyIcon, Check as CheckIcon } from "lucide-react";
import { useState, useEffect } from "react";
import type { Route } from "./+types";
import { encodeSgtin96 } from "~/utils/logic/sgtinGenerator";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Bulk Generator" }];
};

// Represents a single row of input data from the paste area
// Now includes lastSerial per row
type OrderInputRow = {
  styleNumber: string;
  size: string;
  color: string;
  itemName: string;
  itemCode: string; // This is the GTIN
  qtyToGenerate: number;
  lastSerial: string; // New: last serial per row
};

// Represents a single generated SGTIN record
type GeneratedRecord = {
  styleNumber: string;
  itemName: string;
  color: string;
  size: string;
  itemCode: string; // The GTIN
  serial: number;
  sgtin: string; // The generated SGTIN-96
};

// Represents a fully processed order entry, including its generated records
type ProcessedOrderEntry = OrderInputRow & {
  generatedRecords: GeneratedRecord[];
  // A unique ID or index for easier selection in Tabs
  id: string;
};

type BulkFormValues = {
  pastedData: string;
  lastSerial: string; // The starting serial for *each* item code batch
};

const defaultValues: BulkFormValues = {
  pastedData: "",
  lastSerial: "9000", // Default as per your single generator
};

function BulkGenerator() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BulkFormValues>({
    defaultValues,
  });

  const [processedOrderEntries, setProcessedOrderEntries] = useState<
    ProcessedOrderEntry[]
  >([]);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedEntry = processedOrderEntries.find(
    (entry) => entry.id === selectedEntryId
  );

  // Parses the pasted text into an array of OrderInputRow
  const parsePastedData = (data: string): OrderInputRow[] => {
    const lines = data.trim().split("\n");
    const parsedRows: OrderInputRow[] = [];

    lines.forEach((line) => {
      // Split by tab, considering the blank column at index 4
      const parts = line.split("\t");

      // Now expect at least 7 columns (lastSerial at index 6)
      if (parts.length >= 7) {
        parsedRows.push({
          styleNumber: parts[0] || "",
          size: parts[1] || "",
          color: parts[2] || "",
          itemName: parts[3] || "",
          itemCode: parts[4] || "", // Column 5 is Item Code
          qtyToGenerate: parseInt(parts[5], 10) || 0, // Column 6 is Qty
          lastSerial: parts[6] || "9000", // Column 7 is lastSerial, fallback to 9000
        });
      }
    });
    return parsedRows;
  };

  const onSubmit = async (data: BulkFormValues) => {
    setIsLoading(true);
    setProcessedOrderEntries([]); // Clear previous results
    setSelectedEntryId(null);
    setCopied(false);

    // Simulate async work for UX
    await new Promise((res) => setTimeout(res, 500));

    const inputRows = parsePastedData(data.pastedData);
    const newProcessedEntries: ProcessedOrderEntry[] = [];
    let entryCounter = 0; // To create unique IDs for tabs

    inputRows.forEach((row) => {
      const generatedRecords: GeneratedRecord[] = [];
      const startSerial = parseInt(row.lastSerial, 10) + 1; // Use per-row lastSerial

      for (let i = 0; i < row.qtyToGenerate; i++) {
        const serial = startSerial + i;
        const sgtin = encodeSgtin96(row.itemCode, serial.toString());

        generatedRecords.push({
          styleNumber: row.styleNumber,
          itemName: row.itemName || "-",
          color: row.color || "-",
          size: row.size,
          itemCode: row.itemCode,
          serial: serial,
          sgtin,
        });
      }

      newProcessedEntries.push({
        ...row,
        generatedRecords,
        id: `entry-${entryCounter++}`,
      });
    });

    setProcessedOrderEntries(newProcessedEntries);
    if (newProcessedEntries.length > 0) {
      setSelectedEntryId(newProcessedEntries[0].id);
    }
    setIsLoading(false);
  };

  // Copy table to clipboard as tab-separated values for the selected entry
  const handleCopyTable = () => {
    if (!selectedEntry || selectedEntry.generatedRecords.length === 0) return;

    const header = [
      "Style Number",
      "Item Name",
      "Color",
      "Size",
      "Item Code",
      "Serial",
      "SGTIN-96 Hex (EPC Memory Bank Contents)",
    ];
    const rows = selectedEntry.generatedRecords.map((record) => [
      record.styleNumber,
      record.itemName,
      record.color,
      record.size,
      record.itemCode,
      record.serial,
      record.sgtin,
    ]);
    const tsv = [header, ...rows].map((r) => r.join("\t")).join("\n");
    navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleReset = () => {
    reset(defaultValues);
    setProcessedOrderEntries([]);
    setSelectedEntryId(null);
    setCopied(false);
    setIsLoading(false);
  };

  const handleSelectAll = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.target.select();
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-0">
      <h2 className="text-3xl font-bold tracking-tight">Bulk Generator</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-xl font-semibold my-4">Order Data</h3>
        <Label htmlFor="pasted-data">Paste your order data here</Label>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Input Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-4">
            <div className="flex flex-col space-y-2">
              <Textarea
                id="pasted-data"
                placeholder="Paste data from spreadsheet, format: (Style    Size    Color    Item Name    Item Code    Qty    Last Serial)"
                rows={5}
                {...register("pastedData", {
                  required: "Orders data is required",
                })}
                onFocus={handleSelectAll}
              />
              {errors.pastedData && (
                <p className="text-red-500 text-sm">
                  {errors.pastedData.message}
                </p>
              )}
            </div>
            {/* <div className="flex items-center gap-4">
              <Label htmlFor="last-serial" className="whitespace-nowrap">
                Starting Serial (e.g., 9000 for 9001, 9002...)
              </Label>
              <Input
                type="text"
                id="last-serial"
                placeholder="Last Serial"
                className="max-w-[150px]"
                {...register("lastSerial", {
                  required: "Last serial is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Serial must be a number",
                  },
                })}
                onFocus={handleSelectAll}
              />
              {errors.lastSerial && (
                <p className="text-red-500 text-sm">
                  {errors.lastSerial.message}
                </p>
              )}
            </div> */}
          </div>

          {/* Action Buttons */}
          <div className="col-span-1 flex flex-col items-start justify-start space-y-4 p-4 pt-0 md:p-0">
            <Button
              className="w-full max-w-sm transition active:scale-95 duration-100 flex items-center justify-center"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Generate All SGTINs"
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

      {/* Results Section */}
      {processedOrderEntries.length > 0 && (
        <div className="mt-8 space-y-6">
          <h3 className="text-xl font-semibold">Generated Records</h3>

          {/* Tabs for selecting order entry */}
          <Tabs
            value={selectedEntryId || processedOrderEntries[0]?.id}
            onValueChange={setSelectedEntryId}
            className="w-full"
          >
            <TabsList className="flex flex-wrap h-auto min-h-[40px] justify-start">
              {processedOrderEntries.map((entry) => (
                <TabsTrigger
                  key={entry.id}
                  value={entry.id}
                  className="flex-shrink-0 text-wrap py-2"
                >
                  {`${entry.styleNumber} - (${entry.size})`}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Display table for selected entry */}
            {processedOrderEntries.map((entry) => (
              <TabsContent key={entry.id} value={entry.id} className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold">
                    Masterfile for{" "}
                    {`${entry.styleNumber} - ${entry.itemName} (${entry.size} / ${entry.color})`}
                  </h4>
                  <Button
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
                  </Button>
                </div>
                <div className="overflow-auto max-h-[500px]">
                  {" "}
                  {/* Added overflow for large tables */}
                  <Table>
                    <TableCaption>
                      SGTIN-96 Hex (EPC Memory Bank Contents) for the selected
                      order entry.
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Style Number</TableHead>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Item Code</TableHead>
                        <TableHead>Serial</TableHead>
                        <TableHead>
                          SGTIN-96 Hex (EPC Memory Bank Contents)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entry.generatedRecords.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{row.styleNumber}</TableCell>
                          <TableCell>{row.itemName}</TableCell>
                          <TableCell>{row.color}</TableCell>
                          <TableCell>{row.size}</TableCell>
                          <TableCell>{row.itemCode}</TableCell>
                          <TableCell>{row.serial}</TableCell>
                          <TableCell className="font-mono">
                            {row.sgtin}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default BulkGenerator;
