import type { Metadata } from "next";
import { Card, Input, buttonClassName } from "@freight/ui";

import { createShipmentAction } from "./actions";
import { CustomerPicker } from "./CustomerPicker";

export const metadata: Metadata = {
  title: "New shipment | Freight Platform Admin",
};

export default async function NewShipmentPage() {
  // The (authenticated) layout above already redirects unauthenticated
  // requests before this page renders.
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-comfortable px-comfortable py-expansive">
      <header className="flex flex-col gap-tight">
        <h1 className="font-display text-3xl font-semibold text-foreground">New shipment</h1>
      </header>

      <Card>
        <form action={createShipmentAction} className="flex flex-col gap-cozy">
          <Input id="origin" name="origin" label="Origin" placeholder="e.g. Shanghai, CN" />

          <Input
            id="destination"
            name="destination"
            label="Destination"
            placeholder="e.g. Rotterdam, NL"
          />

          <div className="flex flex-col gap-tight">
            <label htmlFor="transportMode" className="font-sans text-sm font-medium text-foreground">
              Transport mode
            </label>
            <select
              id="transportMode"
              name="transportMode"
              defaultValue=""
              className="h-10 rounded-sm border border-border bg-surface px-cozy font-sans text-sm text-foreground transition-colors duration-base ease-standard focus:border-beacon"
            >
              <option value="">—</option>
              <option value="sea">Sea</option>
              <option value="air">Air</option>
              <option value="road">Road</option>
            </select>
          </div>

          <Input
            id="estimatedArrival"
            name="estimatedArrival"
            type="datetime-local"
            label="Estimated arrival (optional)"
          />

          <CustomerPicker />

          <button type="submit" className={buttonClassName("primary", "md")}>
            Create shipment
          </button>
        </form>
      </Card>
    </div>
  );
}
