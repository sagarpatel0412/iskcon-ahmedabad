-- Seeder generated on Tue Jun 23 23:58:18 IST 2026
SET FOREIGN_KEY_CHECKS=0;

-- ===============================
-- Seed data for centres
-- ===============================
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;
SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '759228e8-4789-11f1-92b0-cf4a04380a8c:1-152166';
INSERT INTO `centres` (`id`, `uuid`, `name`, `slug`, `description`, `address`, `city`, `state`, `country`, `phone`, `email`, `website`, `logo_url`, `banner_url`, `latitude`, `longitude`, `is_active`, `is_mother_temple`, `created_at`, `updated_at`, `deleted_at`) VALUES (1,'0aa3f362-57a2-11f1-8ab1-5f0a17545fdf','ISKCON Ahmedabad','iskcon-ahmedabad','A main iskcon centre in satelitte ahmedabad (mother temple)','Satellite Road, Sarkhej - Gandhinagar Hwy, Ahmedabad, Gujarat 380059','Ahmedabad','Gujarat','India','+91 98798 79456','iskconamd@gmail.com','https://iskconahmedabad.com/',NULL,NULL,23.02700000,72.50630000,1,1,'2026-05-25 00:13:06','2026-06-17 04:54:08',NULL),(2,'0aa3f88a-57a2-11f1-8ab1-5f0a17545fdf','ISKCON Kathwada','iskcon-kathwada','A iskcon centre in kathwada ahmedabad','Hare Krishna Gaushala, Kathwada Bhuvaldi Rd, Chunarvas Gali, Kathwada, Gujarat 382430','Ahmedabad','Gujarat','India','+91 70374 91878','official@iskconkathwada.org','https://iskconkathwada.org/',NULL,NULL,23.04648000,72.69164000,1,0,'2026-05-25 00:13:06','2026-06-17 04:43:06',NULL),(4,'b0916646-b7ca-4fd1-8b63-62fa34fb8c6b','ISKCON Chandkheda','iskon-chandkheda','A iskcon centre in chandkheda ahmedabad ',NULL,'Ahmedabad','Gujarat','India',NULL,NULL,NULL,NULL,NULL,23.02700000,72.50630000,1,0,'2026-06-17 04:36:35','2026-06-17 04:50:40',NULL);
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;

-- ===============================
-- Seed data for roles
-- ===============================
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;
SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '759228e8-4789-11f1-92b0-cf4a04380a8c:1-152166';
INSERT INTO `roles` (`id`, `uuid`, `name`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES (1,'72cc52aa-57a1-11f1-8ab1-5f0a17545fdf','ADMIN','System administrator','2026-05-25 00:17:26','2026-05-25 00:20:35',NULL),(2,'72cc5732-57a1-11f1-8ab1-5f0a17545fdf','DEVOTEE','Approved devotee','2026-05-25 00:17:26','2026-05-25 00:20:35',NULL),(3,'72cc58ea-57a1-11f1-8ab1-5f0a17545fdf','SEEKER','Regular seeker/user','2026-05-25 00:17:26','2026-05-25 00:20:35',NULL);
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;

-- ===============================
-- Seed data for product_categories
-- ===============================
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;
SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '759228e8-4789-11f1-92b0-cf4a04380a8c:1-152166';
INSERT INTO `product_categories` (`id`, `uuid`, `centre_id`, `name`, `slug`, `description`, `image_url`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES (1,'3944e4d0-6eca-11f1-99cb-58bca71263b9',1,'Books','books','Spiritual books and scriptures',NULL,1,'2026-06-23 11:40:24','2026-06-23 11:40:24',NULL),(2,'394513f6-6eca-11f1-99cb-58bca71263b9',1,'Worship Items','worship-items','Items used in deity worship',NULL,1,'2026-06-23 11:40:24','2026-06-23 11:40:24',NULL),(3,'394518e2-6eca-11f1-99cb-58bca71263b9',1,'Prasadam','prasadam','Sacred food and snacks',NULL,1,'2026-06-23 11:40:24','2026-06-23 11:40:24',NULL),(4,'39451aa4-6eca-11f1-99cb-58bca71263b9',1,'Japa & Tulasi','japa-tulasi','Japa bags, malas and chanting items',NULL,1,'2026-06-23 11:40:24','2026-06-23 11:40:24',NULL),(5,'39451be4-6eca-11f1-99cb-58bca71263b9',1,'Deity Accessories','deity-accessories','Deity dresses and accessories',NULL,1,'2026-06-23 11:40:24','2026-06-23 11:40:24',NULL),(6,'39451de2-6eca-11f1-99cb-58bca71263b9',1,'Incense & Lamps','incense-lamps','Agarbatti, ghee lamps and puja items',NULL,1,'2026-06-23 11:40:24','2026-06-23 11:40:24',NULL),(7,'39451f36-6eca-11f1-99cb-58bca71263b9',1,'Children Books','children-books','Books for children and youth',NULL,1,'2026-06-23 11:40:24','2026-06-23 11:40:24',NULL),(8,'39452058-6eca-11f1-99cb-58bca71263b9',1,'Magazines','magazines','Back To Godhead and other magazines',NULL,1,'2026-06-23 11:40:24','2026-06-23 11:40:24',NULL);
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;

INSERT INTO email_templates
(uuid, template_key, subject, html_body, text_body, variables_json, is_active, created_at, updated_at)
VALUES

(UUID(), 'LOGIN_OTP',
'Your ISKCON Ahmedabad login OTP is {{otp}}',
'<h2 style="color:#1a0a00;">Hare Krishna {{name}},</h2>
<p style="font-size:15px;line-height:26px;color:#5c3d1a;">Your OTP for login is:</p>
<div style="margin:24px 0;text-align:center;">
  <span style="display:inline-block;background:#f5e8c8;color:#1a0a00;font-size:32px;font-weight:900;letter-spacing:8px;padding:16px 28px;border-radius:18px;">{{otp}}</span>
</div>
<p style="font-size:14px;line-height:24px;color:#5c3d1a;">This OTP is valid for {{expiry_minutes}} minutes. Please do not share it with anyone.</p>',
'Your OTP is {{otp}}. Valid for {{expiry_minutes}} minutes.',
JSON_ARRAY('name','otp','expiry_minutes'), 1, NOW(), NOW()),


(UUID(), 'REGISTER_SUCCESS',
'Welcome to ISKCON Ahmedabad, {{name}}',
'<h2 style="color:#1a0a00;">Hare Krishna {{name}} 🙏</h2>
<p style="font-size:15px;line-height:26px;color:#5c3d1a;">Your registration with ISKCON Ahmedabad has been completed successfully.</p>
<p style="font-size:15px;line-height:26px;color:#5c3d1a;">You can now explore events, courses, trips, shop products, devotional content, and spiritual progress features.</p>
<a href="{{login_url}}" style="display:inline-block;margin-top:18px;background:#c8902a;color:#1a0a00;text-decoration:none;font-weight:900;padding:14px 22px;border-radius:16px;">Login Now</a>',
'Welcome {{name}}. Your registration is successful. Login: {{login_url}}',
JSON_ARRAY('name','login_url'), 1, NOW(), NOW()),


(UUID(), 'EVENT_REGISTRATION_SUCCESS',
'Your event registration is confirmed: {{event_title}}',
'<h2 style="color:#1a0a00;">Hare Krishna {{name}} 🙏</h2>
<p style="font-size:15px;line-height:26px;color:#5c3d1a;">Your registration for <b>{{event_title}}</b> is confirmed.</p>
<div style="background:#fdfaf5;border:1px solid #ede0c8;border-radius:18px;padding:18px;margin:20px 0;">
  <p><b>Date:</b> {{event_date}}</p>
  <p><b>Time:</b> {{event_time}}</p>
  <p><b>Location:</b> {{event_location}}</p>
</div>
<p style="font-size:14px;line-height:24px;color:#5c3d1a;">Please keep your QR code ready at the entry if required.</p>
<a href="{{event_url}}" style="display:inline-block;margin-top:12px;background:#c8902a;color:#1a0a00;text-decoration:none;font-weight:900;padding:14px 22px;border-radius:16px;">View Event</a>',
'Registered for {{event_title}} on {{event_date}} at {{event_time}}. Location: {{event_location}}',
JSON_ARRAY('name','event_title','event_date','event_time','event_location','event_url'), 1, NOW(), NOW()),


(UUID(), 'TRIP_REGISTRATION_SUCCESS',
'Your yatra registration is confirmed: {{trip_title}}',
'<h2 style="color:#1a0a00;">Hare Krishna {{name}} 🙏</h2>
<p style="font-size:15px;line-height:26px;color:#5c3d1a;">Your registration for <b>{{trip_title}}</b> has been confirmed.</p>
<div style="background:#fdfaf5;border:1px solid #ede0c8;border-radius:18px;padding:18px;margin:20px 0;">
  <p><b>Destination:</b> {{destination}}</p>
  <p><b>Dates:</b> {{start_date}} to {{end_date}}</p>
  <p><b>Departure City:</b> {{departure_city}}</p>
  <p><b>Meeting Point:</b> {{meeting_point}}</p>
</div>
<a href="{{trip_url}}" style="display:inline-block;margin-top:12px;background:#c8902a;color:#1a0a00;text-decoration:none;font-weight:900;padding:14px 22px;border-radius:16px;">View Trip</a>',
'Trip confirmed: {{trip_title}}, {{start_date}} to {{end_date}}, {{destination}}.',
JSON_ARRAY('name','trip_title','destination','start_date','end_date','departure_city','meeting_point','trip_url'), 1, NOW(), NOW()),


(UUID(), 'COURSE_REGISTRATION_SUCCESS',
'Your course registration is confirmed: {{course_title}}',
'<h2 style="color:#1a0a00;">Hare Krishna {{name}} 🙏</h2>
<p style="font-size:15px;line-height:26px;color:#5c3d1a;">You have successfully registered for <b>{{course_title}}</b>.</p>
<div style="background:#fdfaf5;border:1px solid #ede0c8;border-radius:18px;padding:18px;margin:20px 0;">
  <p><b>Mode:</b> {{course_mode}}</p>
  <p><b>Dates:</b> {{start_date}} to {{end_date}}</p>
  <p><b>Time:</b> {{course_time}}</p>
  <p><b>Venue:</b> {{venue}}</p>
</div>
<a href="{{course_url}}" style="display:inline-block;margin-top:12px;background:#c8902a;color:#1a0a00;text-decoration:none;font-weight:900;padding:14px 22px;border-radius:16px;">View Course</a>',
'Course confirmed: {{course_title}}, {{start_date}} to {{end_date}}.',
JSON_ARRAY('name','course_title','course_mode','start_date','end_date','course_time','venue','course_url'), 1, NOW(), NOW()),


(UUID(), 'REPORT_PROBLEM_RECEIVED',
'We received your report: {{issue_title}}',
'<h2 style="color:#1a0a00;">Hare Krishna {{name}},</h2>
<p style="font-size:15px;line-height:26px;color:#5c3d1a;">Thank you for reporting a problem. Our team has received your request.</p>
<div style="background:#fdfaf5;border:1px solid #ede0c8;border-radius:18px;padding:18px;margin:20px 0;">
  <p><b>Issue:</b> {{issue_title}}</p>
  <p><b>Ticket ID:</b> {{ticket_id}}</p>
  <p><b>Status:</b> Received</p>
</div>
<p style="font-size:14px;line-height:24px;color:#5c3d1a;">We will review it and get back to you if needed.</p>',
'We received your report {{issue_title}}. Ticket ID: {{ticket_id}}',
JSON_ARRAY('name','issue_title','ticket_id'), 1, NOW(), NOW()),


(UUID(), 'DEVOTEE_INVITATION',
'You are invited to join ISKCON Ahmedabad as a devotee',
'<h2 style="color:#1a0a00;">Hare Krishna {{name}} 🙏</h2>
<p style="font-size:15px;line-height:26px;color:#5c3d1a;">You have been invited by <b>{{invited_by}}</b> to join ISKCON Ahmedabad as a verified devotee.</p>
<p style="font-size:15px;line-height:26px;color:#5c3d1a;">Please accept the invitation using the button below.</p>
<a href="{{invitation_url}}" style="display:inline-block;margin-top:18px;background:#c8902a;color:#1a0a00;text-decoration:none;font-weight:900;padding:14px 22px;border-radius:16px;">Accept Invitation</a>
<p style="font-size:13px;line-height:22px;color:#9a7a4a;margin-top:20px;">This invitation expires on {{expires_at}}.</p>',
'You are invited by {{invited_by}}. Accept here: {{invitation_url}}',
JSON_ARRAY('name','invited_by','invitation_url','expires_at'), 1, NOW(), NOW()),


(UUID(), 'ORDER_CONFIRMATION',
'Your temple shop order is confirmed: {{order_number}}',
'<h2 style="color:#1a0a00;">Hare Krishna {{name}} 🙏</h2>
<p style="font-size:15px;line-height:26px;color:#5c3d1a;">Your temple shop order has been placed successfully.</p>
<div style="background:#fdfaf5;border:1px solid #ede0c8;border-radius:18px;padding:18px;margin:20px 0;">
  <p><b>Order Number:</b> {{order_number}}</p>
  <p><b>Total Amount:</b> ₹{{total_amount}}</p>
  <p><b>Payment Status:</b> {{payment_status}}</p>
</div>
<a href="{{order_url}}" style="display:inline-block;margin-top:12px;background:#c8902a;color:#1a0a00;text-decoration:none;font-weight:900;padding:14px 22px;border-radius:16px;">View Order</a>',
'Order confirmed: {{order_number}}, Total ₹{{total_amount}}.',
JSON_ARRAY('name','order_number','total_amount','payment_status','order_url'), 1, NOW(), NOW()),


(UUID(), 'SHIPPING_UPDATE',
'Shipping update for your order {{order_number}}',
'<h2 style="color:#1a0a00;">Hare Krishna {{name}},</h2>
<p style="font-size:15px;line-height:26px;color:#5c3d1a;">Your order shipping status has been updated.</p>
<div style="background:#fdfaf5;border:1px solid #ede0c8;border-radius:18px;padding:18px;margin:20px 0;">
  <p><b>Order Number:</b> {{order_number}}</p>
  <p><b>Status:</b> {{order_status}}</p>
  <p><b>Courier:</b> {{courier_name}}</p>
  <p><b>Tracking Number:</b> {{tracking_number}}</p>
</div>
<a href="{{tracking_url}}" style="display:inline-block;margin-top:12px;background:#c8902a;color:#1a0a00;text-decoration:none;font-weight:900;padding:14px 22px;border-radius:16px;">Track Order</a>',
'Order {{order_number}} status: {{order_status}}. Tracking: {{tracking_number}}',
JSON_ARRAY('name','order_number','order_status','courier_name','tracking_number','tracking_url'), 1, NOW(), NOW()),


(UUID(), 'PAYMENT_SUCCESS',
'Payment successful for {{purpose_title}}',
'<h2 style="color:#1a0a00;">Hare Krishna {{name}} 🙏</h2>
<p style="font-size:15px;line-height:26px;color:#5c3d1a;">Your payment for <b>{{purpose_title}}</b> was successful.</p>
<div style="background:#fdfaf5;border:1px solid #ede0c8;border-radius:18px;padding:18px;margin:20px 0;">
  <p><b>Amount:</b> ₹{{amount}}</p>
  <p><b>Payment ID:</b> {{payment_id}}</p>
</div>',
'Payment successful for {{purpose_title}}. Amount ₹{{amount}}. Payment ID: {{payment_id}}',
JSON_ARRAY('name','purpose_title','amount','payment_id'), 1, NOW(), NOW());

SET FOREIGN_KEY_CHECKS=1;
