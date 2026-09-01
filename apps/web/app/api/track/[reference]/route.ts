import { NextResponse } from "next/server";

import { getShipmentWithEvents } from "@freight/database";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;

  const result = await getShipmentWithEvents(reference);

  if (!result) {
    return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
