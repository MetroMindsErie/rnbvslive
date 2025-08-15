-- Clear existing data
DELETE FROM cart_items;
DELETE FROM products;
DELETE FROM mashups;
DELETE FROM blog_posts;
DELETE FROM events;

-- Insert test events with Unsplash images
INSERT INTO events (title, date, venue, description, image_url, ticket_url) VALUES
('Aye Tea Elle Celebrities & Cigars pt. 3', '2025-08-27', 'ATL Nightclub', 'The hottest R&B battle featuring celebrity guests and premium cigars', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop', 'https://tickets.example.com/atl-cigars'),
('Summer Heat R&B Showdown', '2025-07-15', 'Miami Beach Arena', 'Beach vibes meet R&B fire in this epic summer battle', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop', 'https://tickets.example.com/miami-heat'),
('NYC Underground R&B Wars', '2025-06-10', 'Brooklyn Warehouse', 'Raw, unfiltered R&B battles in the heart of Brooklyn', 'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=800&h=600&fit=crop', 'https://tickets.example.com/nyc-underground'),
('Soulful Saturday Sessions', '2025-05-22', 'Chicago Soul Lounge', 'Intimate R&B performances with classic soul vibes', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop', 'https://tickets.example.com/chicago-soul'),
('West Coast R&B Festival', '2025-09-18', 'Los Angeles Convention Center', 'Three days of the best R&B talent from the West Coast', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop', 'https://tickets.example.com/west-coast-fest'),
('R&B vs Hip-Hop: The Ultimate Battle', '2025-10-31', 'Las Vegas Strip', 'Halloween special: R&B artists face off against hip-hop legends', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop', 'https://tickets.example.com/vegas-battle');

-- Insert test blog posts with Unsplash images
INSERT INTO blog_posts (title, content, excerpt, image_url, published_date) VALUES
('Drumma Boy & Friends Live Performance Review', 'An incredible night of beats and rhythm as Drumma Boy brought his signature sound to the stage. The energy was electric as he showcased both classic hits and new material, proving why he remains a cornerstone of modern R&B production.', 'Drumma Boy delivers an unforgettable performance with signature beats and incredible energy.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', '2025-06-25'),
('Sunshine Anderson & Friends: A Night to Remember', 'Sunshine Anderson graced our stage with her powerful vocals and timeless hits. Joined by special guests, the evening was filled with soulful melodies and heartfelt performances that reminded everyone why R&B is the music of the soul.', 'Sunshine Anderson and friends deliver soulful performances in an intimate setting.', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop', '2025-01-28'),
('The Evolution of R&B Battles', 'From the streets to the stage, R&B battles have evolved into spectacular entertainment events. We explore how competition drives creativity and pushes artists to deliver their absolute best performances.', 'Exploring how R&B battles have transformed from street competitions to major entertainment events.', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop', '2025-03-15'),
('Behind the Scenes: Setting Up R&B Versus LIVE', 'Take a peek behind the curtain to see what it takes to create the perfect R&B battle environment. From sound engineering to stage design, every detail matters in creating an unforgettable experience.', 'An inside look at the production process behind our epic R&B battle events.', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop', '2025-02-10'),
('New Artist Spotlight: Rising R&B Stars', 'Meet the next generation of R&B talent making waves in the industry. These artists are bringing fresh perspectives while honoring the rich traditions of rhythm and blues.', 'Discover the emerging R&B artists who are shaping the future of the genre.', 'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=800&h=600&fit=crop', '2025-04-20');

-- Insert test mashups
INSERT INTO mashups (title, description, embed_url, platform, thumbnail_url) VALUES
('RNBV MashUPs Vol 1', 'The ultimate collection of R&B classics mixed with modern beats', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'youtube', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'),
('Smooth Operator Remix Collection', 'Silky smooth R&B remixes that will get you in the mood', 'https://www.instagram.com/p/example', 'instagram', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'),
('90s R&B vs 2020s Mashup', 'Classic 90s R&B meets modern production in this epic mashup', 'https://www.youtube.com/embed/example2', 'youtube', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop'),
('Soul Train Revival Mix', 'Bringing back the Soul Train energy with contemporary R&B artists', 'https://twitter.com/i/status/example', 'x', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop'),
('Late Night R&B Vibes', 'Perfect playlist for those intimate late-night moments', 'https://www.youtube.com/embed/example3', 'youtube', 'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=400&h=300&fit=crop');

-- Insert test products with Unsplash images
INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES
('R&B Versus LIVE Tour T-Shirt', 'Official tour merchandise featuring the iconic R&B Versus LIVE logo', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 'apparel', 50),
('Limited Edition Poster Set', 'Exclusive poster collection featuring artwork from our biggest battles', 24.99, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop', 'collectibles', 25),
('VIP Experience Package', 'Ultimate VIP package including backstage access, meet & greets, and exclusive merchandise', 199.99, 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&h=400&fit=crop', 'experiences', 10),
('R&B Versus Hoodie', 'Premium quality hoodie perfect for those cool concert nights', 49.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', 'apparel', 30),
('Battle Mix CD Collection', 'Compilation of the best performances from our live battles', 19.99, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', 'music', 100),
('Custom R&B Versus Cap', 'Stylish cap with embroidered logo, perfect for any R&B fan', 24.99, 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=400&fit=crop', 'apparel', 40),
('Platinum Member Card', 'Exclusive membership card with special perks and discounts', 99.99, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop', 'memberships', 15),
('Vintage Concert Photo Print', 'High-quality prints from iconic R&B Versus LIVE moments', 34.99, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', 'collectibles', 20);

-- Insert some sample cart items (optional - for testing cart functionality)
INSERT INTO cart_items (session_id, product_id, quantity) VALUES
('test_session_1', (SELECT id FROM products WHERE name = 'R&B Versus LIVE Tour T-Shirt' LIMIT 1), 2),
('test_session_1', (SELECT id FROM products WHERE name = 'Limited Edition Poster Set' LIMIT 1), 1);
