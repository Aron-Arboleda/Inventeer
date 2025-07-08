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

export const meta: Route.MetaFunction = () => {
  return [{ title: "Calculator" }];
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

function Page() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    // handle form submission
    console.log(data);
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-0">
      <h2 className="text-3xl font-bold tracking-tight">Calculator</h2>

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
                className="max-w-[250px]"
                disabled={true}
                {...register("firstSgtin")}
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
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start space-y-4 p-4 pt-0">
            <Button className="w-full max-w-sm" type="submit">
              Generate
            </Button>
            <Button
              className="w-full max-w-sm"
              type="button"
              onClick={() => reset()}
              variant="secondary"
            >
              Reset
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Page;

{
  /* <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscriptions
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Now
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  You made 265 sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs> */
}
