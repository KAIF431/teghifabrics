# TEGHI — Luxury Fabrics & Textiles
### Digital Showroom & Interactive Fabric Museum (Demo Project)

A mobile-first, ultra-high performance digital showroom experience crafted for **Teghi Chadar Store, Malad (West), Mumbai**.

---

## ✦ Key Highlights & Features

1. **60-30-10 Luxury Visual Identity**:
   - **60% Primary Canvas**: Warm Ivory & Alabaster (`#FAF8F5` / `#FFFFFF`).
   - **30% Structure & Depth**: Rich Charcoal Espresso (`#1A1715`) & Warm Sand (`#EFE9DF`).
   - **10% Hero Accent (Jaan daalne wala)**: Radiant Champagne Antique Gold (`#C5A059` / `#D4AF37`) & WhatsApp Pulse.

2. **Signature Hero Showcase**:
   - **Imported Heavy Worked Net** with high-resolution macro embroidery details (Zardozi, moti, sequins).
   - **Purchase Mode Selector**: "Per Metre" vs "Complete Dress Set" (Includes Net, Dupatta, Astar & Salwar).

3. **Curated Fabric Catalogue**:
   - Heavy Worked Net, Pure Silk, Cotton Satin, Liquid Satin, Handloom Cotton, Butter Crepe.
   - Interactive filter pills, swatch previews, and instant bottom sheet inspection.

4. **Intelligent Colour Variation System**:
   - 8–12 trending shade chips per fabric.
   - Live shade selection and display.
   - Direct prompt: *"Looking for a custom shade? 1000+ In-Store Shades available on WhatsApp"*.

5. **WhatsApp Enquiry Flow**:
   - Generates pre-formatted inquiry text with product name, selected mode (metres/dress set), selected color shade, and price estimate.
   - One-tap redirect to WhatsApp.

6. **Mobile-First Owner Admin Panel (`/admin.html`)**:
   - **PIN-Protected**: Default PIN `1234`.
   - **Monthly Performance Dashboard**: Tracks total visitors, WhatsApp inquiries initiated, and conversion rate (`%`).
   - **Dynamic WhatsApp Number Setting**: Owner can change their phone number directly from their phone screen without touching code.
   - **Price & Stock Editor**: Inline rate editor and In-Stock / Out-of-Stock toggles.
   - **Add New Fabric**: Photo upload with client-side canvas compression from mobile gallery/camera.

---

## ✦ Free Live Deployment (₹0 Cost)

To share this demo link with the shop owner:

### Option A: GitHub Pages (Recommended)
1. Push this folder to a new GitHub repository:
   ```bash
   git add .
   git commit -m "Initial TEGHI Luxury Fabrics demo release"
   git remote add origin https://github.com/<your-username>/teghi-luxury-fabrics.git
   git push -u origin master
   ```
2. In GitHub repository settings -> **Pages** -> Select `master` branch -> Save.
3. Your live link will be: `https://<your-username>.github.io/teghi-luxury-fabrics/`

### Option B: Netlify Drop (Instant Drag & Drop)
1. Visit [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop this `teghi-luxury-fabrics` folder directly into the browser.
3. You get an instant HTTPS live link in 10 seconds!

---

## ✦ Local Development

Run local preview server:
```bash
python -m http.server 8080
```
Open [http://localhost:8080/](http://localhost:8080/) in your browser.
Open [http://localhost:8080/admin.html](http://localhost:8080/admin.html) for Admin Portal (PIN: `1234`).
