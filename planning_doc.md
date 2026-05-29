# Enterprise Scaling Planning Document: MediTex B2B Platform

This document describes the long-term scale-up strategy, system architecture, database layout, and cross-border expansion plan for **MediTex** (Sri Lankan domestic clinical supply and European export distribution).

---

## 1. System Goals & B2B Architecture
MediTex is designed to handle two distinct market segments from a single cloud application instance:
1.  **Sri Lankan Market:** Domestic sales to healthcare distributors and government procurement bodies (Ministry of Health / Medical Supplies Division - MSD).
2.  **European Export Market:** Global distribution of sterile medical dressings matching CE directives and European Pharmacopoeia (BP) regulations.

### GeoIP Router & Caching Layout
To deliver optimal experience and currency matching, global requests route through Cloudflare Edge workers:
*   **Sri Lankan IPs:** Directs traffic to LKR listings, displaying local bank coordinates for invoice wire slips uploads.
*   **European/Western IPs:** Directs traffic to USD/EUR pricing with online invoicing rails (Stripe B2B) and a document center for CE compliance sheets downloads.

---

## 2. Infrastructure & Scalability Strategy

```
                          [ B2B Edge Router ]
                                   |
                +------------------+------------------+
                |                                     |
         [ Sri Lanka IP ]                       [ European IP ]
                |                                     |
     LKR Catalog & Bank Slips             USD/EUR Catalog & CE Sheets
                |                                     |
                +------------------+------------------+
                                   |
                          [ API Load Balancer ]
                                   |
                       [ Next.js Server cluster ]
                                   |
                     [ PgBouncer Connection Pool ]
                                   |
                   +---------------+---------------+
                   | (Write)                       | (Read Replicas)
        [ Primary Database ] -------------> [ Standby Database ]
        (Singapore Region)                  (Frankfurt Region)
```

### Database Georeplication
To ensure sub-second response times in both Colombo and Europe:
*   **Primary DB Instance:** Hosted in **AWS Singapore** (optimal fiber transit latency to Sri Lanka and stable lines to Europe).
*   **Read Replica:** Setup in **AWS Frankfurt** (Europe-West) to offload catalog reading and certificate downloading workloads for international customers.
*   **Connection Pooling:** Configure **PgBouncer** in front of PostgreSQL to handle high-frequency database connection request bursts during peak procurement auditing hours.

---

## 3. Database Schema Overview
The system schema is split into three domain-driven segments:

### Product Catalog
*   `products`: Holds dressing models, specifications JSON arrays, image paths, sterile flags, and certifications array.

### B2B Transactional Logs
*   `quote_requests`: Client company coordinates, email, message logs, and workflow status (Pending, Contacted, Fulfilled).
*   `quote_request_items`: Cart items list referencing quantity and custom instructions (e.g. customized dimensions).

### Enterprise ERP Extension
*   `raw_materials`: Tracks quantities of raw yarn, bleached cotton, packaging boxes, and signals warnings when inventory falls under custom reorder triggers.
*   `production_batches`: Scheduled and completed production lot runs. Completing a run automatically deducts raw components and increases catalog stock.
*   `shipments`: Cargo shipping logs containing carriers, container tracking IDs, and customs paperwork attachment pathways.

---

## 4. Multi-Phase Implementation Roadmap
*   **Phase 1 (Core B2B Portal):** Client account registrations, LKR/EUR geographic currency routing, PDF invoice generations.
*   **Phase 2 (Automated ERP Sync):** Automated lot number generation, inventory warning emails, raw materials deduction calculation triggers.
*   **Phase 3 (Hospital EDI Integrations):** Electronic Data Interchange adapters (EDI 850/810) allowing European hospital networks to pull inventory details directly into their automated procurement engines.
