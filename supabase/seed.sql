-- Golf Charity Platform - Seed Data
-- Run this after schema.sql

-- ============================================
-- SAMPLE CHARITIES
-- ============================================
INSERT INTO charities (id, name, description, image, website, featured) VALUES
  ('11111111-1111-1111-1111-111111111111', 'First Tee', 'Building game changers by providing young people with character education and life skills through golf.', 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800', 'https://firsttee.org', true),
  ('22222222-2222-2222-2222-222222222222', 'Golf Fore Africa', 'Providing clean water, nutrition, education, and healthcare to communities in sub-Saharan Africa.', 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800', 'https://golfforeafrica.org', true),
  ('33333333-3333-3333-3333-333333333333', 'St. Jude Children''s Research Hospital', 'Leading the way the world understands, treats, and defeats childhood cancer and other life-threatening diseases.', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800', 'https://stjude.org', true),
  ('44444444-4444-4444-4444-444444444444', 'PGA HOPE', 'Introducing golf to veterans with disabilities to enhance their physical, mental, social, and emotional well-being.', 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800', 'https://pgareach.org', false),
  ('55555555-5555-5555-5555-555555555555', 'The Nature Conservancy', 'Protecting the lands and waters on which all life depends. Conservation through science and partnership.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', 'https://nature.org', false),
  ('66666666-6666-6666-6666-666666666666', 'Folds of Honor', 'Providing educational scholarships to the spouses and children of fallen and disabled service members.', 'https://images.unsplash.com/photo-1529243856184-fd5465488984?w=800', 'https://foldsofhonor.org', true);

-- ============================================
-- SAMPLE PRIZE POOL
-- ============================================
INSERT INTO prize_pool (month, total_pool, five_match_pool, four_match_pool, three_match_pool, rollover_amount) VALUES
  ('2026-01-01', 4500.00, 1800.00, 1575.00, 1125.00, 0),
  ('2026-02-01', 5200.00, 3880.00, 1820.00, 1300.00, 1800.00),
  ('2026-03-01', 4800.00, 1920.00, 1680.00, 1200.00, 0);
