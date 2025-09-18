# Production Features Setup Guide

## Overview

Panduan ini menjelaskan cara mengatur dan menjalankan fitur-fitur high priority yang telah diimplementasikan:

1. **Production Planning & Scheduling**
2. **Inventory Management** 
3. **Advanced Reporting & Analytics**

## Database Setup

### 1. Apply Production Schema

Jalankan SQL script berikut di Supabase SQL Editor untuk membuat tabel-tabel yang dibutuhkan:

```bash
# Upload file supabase/production-schema.sql ke Supabase SQL Editor dan execute
```

Schema ini akan membuat tabel-tabel berikut:
- `production_schedules` - Jadwal produksi
- `production_tasks` - Task breakdown produksi
- `workers` - Data pekerja/staff
- `machines` - Data mesin dan equipment
- `inventory` - Stock management
- `stock_movements` - Tracking pergerakan stock
- `quality_checkpoints` - Quality control
- `production_metrics` - Metrics produksi

### 2. Sample Data

Script sudah termasuk sample data untuk:
- 4 workers dengan skills berbeda
- 4 machines dasar
- Sample inventory items

## Fitur yang Telah Diimplementasikan

### 1. Production Planning & Scheduling (`/admin/production`)

**Fitur:**
- Real-time production dashboard
- KPI monitoring (efficiency, on-time delivery, resource utilization, quality score)
- Production schedule management
- Start/complete production tracking
- Resource status monitoring
- Auto-schedule creation saat order status berubah ke 'diproses'

**Fungsi Utama:**
- View active schedules dengan progress tracking
- Update status produksi (scheduled → in_progress → completed)
- Monitor resource availability (workers, machines)
- Track pending tasks

### 2. Inventory Management (`/admin/inventory`)

**Fitur:**
- Comprehensive inventory dashboard
- Stock level monitoring dengan alert otomatis
- Add/edit/delete inventory items
- Search dan filter materials
- Stock status indicators (Normal, Low Stock, Overstock)
- Supplier management
- Total inventory valuation

**Fungsi Utama:**
- Real-time stock tracking
- Low stock alerts (automatic notifications)
- Material cost tracking
- Location-based inventory
- Recent stock movements monitoring

### 3. Advanced Reporting & Analytics (`/admin/reports`)

**Fitur:**
- Multi-period reporting (7d, 30d, 90d, 1y)
- Revenue trend analysis dengan charts
- Order completion tracking
- Customer growth metrics
- Top selling materials analysis
- Production performance metrics
- CSV export functionality

**KPI yang Dilacak:**
- Total revenue dengan comparison
- Order completion rates
- Customer acquisition
- Production efficiency
- Quality scores
- On-time delivery rates

## Navigasi

Menu baru telah ditambahkan di admin dashboard:
- **Production** - Production planning dan scheduling
- **Inventory** - Stock management
- **Reports** - Advanced analytics

## Integrasi dengan System Existing

### 1. Order Integration
- Production schedule otomatis dibuat saat order status = 'diproses'
- Progress tracking terintegrasi dengan order status
- Estimated completion date calculation

### 2. Notification System
- Low stock alerts untuk admin
- Production milestone notifications
- Quality checkpoint alerts

### 3. Real-time Updates
- Supabase real-time subscriptions
- Live dashboard updates
- Auto-refresh functionality

## Database Triggers & Functions

### 1. Auto Production Schedule
- Trigger: `auto_create_production_schedule`
- Fungsi: Membuat jadwal produksi otomatis saat order diproses
- Priority: Berdasarkan quantity order

### 2. Inventory Alerts
- Trigger: `check_inventory_trigger`
- Fungsi: Alert otomatis saat stock dibawah minimum
- Notification: Dikirim ke semua admin

### 3. Timestamp Updates
- Auto-update `updated_at` fields
- Audit trail untuk semua perubahan

## Permissions & Security

### RLS Policies
- Admin: Full access ke semua production data
- Customer: Read-only access ke production schedule order mereka
- Worker-specific: Bisa ditambahkan untuk worker access

### Data Protection
- Semua tabel menggunakan Row Level Security
- UUID sebagai primary keys
- Audit trail dengan timestamps

## Next Steps

Setelah setup berhasil, Anda dapat:

1. **Test Production Flow:**
   - Buat order baru
   - Ubah status ke 'diproses'
   - Lihat auto-generated production schedule
   - Track progress di Production dashboard

2. **Test Inventory:**
   - Add material baru
   - Set minimum stock levels
   - Test low stock alerts

3. **Test Reporting:**
   - Generate reports dengan berbagai time ranges
   - Export CSV reports
   - Monitor KPI trends

## Troubleshooting

### Common Issues:

1. **RLS Access Denied**
   - Pastikan user memiliki role 'admin' di profiles table
   - Check RLS policies sudah diapply dengan benar

2. **Triggers Not Working**
   - Verify triggers telah dibuat dengan benar
   - Check function permissions

3. **Missing Data**
   - Insert sample data dari production-schema.sql
   - Verify table relationships

## Future Enhancements

Fitur yang dapat ditambahkan selanjutnya:
- Worker scheduling dengan shift management
- Machine maintenance tracking
- Advanced quality control dengan photos
- Predictive analytics
- Mobile app untuk workers
- Barcode/QR code integration
- Automated reordering
- Multi-location inventory

## Support

Untuk bantuan lebih lanjut:
1. Check database logs di Supabase
2. Monitor real-time subscriptions
3. Verify API calls di Network tab
4. Check console errors di Developer Tools

---

**Note:** Pastikan untuk backup database sebelum menjalankan production schema dalam environment production.