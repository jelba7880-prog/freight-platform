#!/usr/bin/env node
// Throwaway seed: a spread of offices across regions, for exercising the
// /locations search page end to end. Not part of the app.
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("[seed-locations] Missing DATABASE_URL");
  process.exit(1);
}

const sql = neon(databaseUrl);

// Services slugs match packages/ui/src/nav-data.ts's SERVICES.
const OFFICES = [
  {
    name: "Shanghai Gateway Office",
    addressLine: "88 Yan'an East Road, Huangpu District",
    city: "Shanghai",
    country: "China",
    postcode: "200002",
    phone: "+86 21 5049 8800",
    services: ["sea-freight", "customs-clearance", "cargo-insurance"],
  },
  {
    name: "Singapore Regional Hub",
    addressLine: "10 Pasir Panjang Road, #05-01 Mapletree Business City",
    city: "Singapore",
    country: "Singapore",
    postcode: "117438",
    phone: "+65 6774 2200",
    services: ["sea-freight", "air-freight", "warehousing-fulfilment-distribution"],
  },
  {
    name: "Mumbai Andheri Office",
    addressLine: "Level 6, One BKC, Bandra Kurla Complex",
    city: "Mumbai",
    country: "India",
    postcode: "400051",
    phone: "+91 22 6157 3000",
    services: ["air-freight", "customs-clearance"],
  },
  {
    name: "Rotterdam Port Office",
    addressLine: "Waalhaven Zuidzijde 33",
    city: "Rotterdam",
    country: "Netherlands",
    postcode: "3087 BM",
    phone: "+31 10 405 1200",
    services: ["sea-freight", "road-freight", "cold-chain-logistics", "cargo-insurance"],
  },
  {
    name: "Hamburg Speicherstadt Office",
    addressLine: "Osakaallee 4",
    city: "Hamburg",
    country: "Germany",
    postcode: "20457",
    phone: "+49 40 30 06 60",
    services: ["sea-freight", "road-freight", "customs-clearance"],
  },
  {
    name: "London Docklands Office",
    addressLine: "1 Cabot Square, Canary Wharf",
    city: "London",
    country: "United Kingdom",
    postcode: "E14 4QJ",
    phone: "+44 20 7093 4400",
    services: ["air-freight", "road-freight", "warehousing-fulfilment-distribution"],
  },
  {
    name: "Los Angeles Basin Office",
    addressLine: "19601 Figueroa Street",
    city: "Carson",
    country: "United States",
    postcode: "90745",
    phone: "+1 310 604 1800",
    services: ["sea-freight", "ecommerce-logistics", "warehousing-fulfilment-distribution"],
  },
  {
    name: "New York Metro Office",
    addressLine: "150 Meadowlands Parkway",
    city: "Secaucus",
    country: "United States",
    postcode: "07094",
    phone: "+1 201 553 6600",
    services: ["air-freight", "ecommerce-logistics"],
  },
  {
    name: "Toronto Pearson Office",
    addressLine: "5895 Ambler Drive",
    city: "Mississauga",
    country: "Canada",
    postcode: "L4W 5B2",
    phone: "+1 905 673 6900",
    services: ["air-freight", "road-freight", "customs-clearance"],
  },
  {
    name: "São Paulo Santos Corridor Office",
    addressLine: "Avenida das Nações Unidas, 14401",
    city: "São Paulo",
    country: "Brazil",
    postcode: "04794-000",
    phone: "+55 11 3040 9500",
    services: ["sea-freight", "customs-clearance", "cargo-insurance"],
  },
  {
    name: "Dubai Jebel Ali Office",
    addressLine: "Jebel Ali Free Zone, LOB 15",
    city: "Dubai",
    country: "United Arab Emirates",
    postcode: "17041",
    phone: "+971 4 881 5600",
    services: ["sea-freight", "air-freight", "warehousing-fulfilment-distribution", "customs-clearance"],
  },
  {
    name: "Nairobi Regional Office",
    addressLine: "Mombasa Road, Belle Vue Center",
    city: "Nairobi",
    country: "Kenya",
    postcode: "00100",
    phone: "+254 20 699 3000",
    services: ["air-freight", "road-freight", "customs-clearance"],
  },
  {
    name: "Sydney Port Botany Office",
    addressLine: "12 Beauchamp Road, Matraville",
    city: "Sydney",
    country: "Australia",
    postcode: "2036",
    phone: "+61 2 9666 3400",
    services: ["sea-freight", "air-freight", "cold-chain-logistics"],
  },
];

for (const office of OFFICES) {
  const [row] = await sql`
    insert into locations (name, address_line, city, country, postcode, phone, services)
    values (
      ${office.name},
      ${office.addressLine},
      ${office.city},
      ${office.country},
      ${office.postcode},
      ${office.phone},
      ${office.services}
    )
    returning id, name
  `;
  console.log("[seed-locations] inserted:", row);
}

console.log(`[seed-locations] inserted ${OFFICES.length} offices`);
