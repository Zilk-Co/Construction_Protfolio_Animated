-- Seed Testimonials
INSERT INTO testimonials (name, role, company, content, rating, published, sort_order, created_at, updated_at)
VALUES
  ('Mohammed Al-Rashid', 'Project Director', 'Saudi Binladin Group', 'Azhar Engineering delivered exceptional quality on our flagship project. Their attention to detail and commitment to safety standards exceeded our expectations. A truly professional team.', 5, true, 1, NOW(), NOW()),
  ('Sarah Mitchell', 'VP of Operations', 'Emaar Properties', 'Working with Azhar Engineering has been a pleasure. They brought innovative solutions to complex challenges and delivered on time and within budget. Highly recommended for large-scale construction.', 5, true, 2, NOW(), NOW()),
  ('James Chen', 'Senior Engineer', 'AECOM', 'The structural engineering work by Azhar was outstanding. Their team demonstrated deep technical expertise and maintained clear communication throughout the project lifecycle.', 5, true, 3, NOW(), NOW());

-- Seed Jobs
INSERT INTO jobs (title, slug, department, location, type, description, requirements, published, sort_order, created_at, updated_at)
VALUES
  ('Site Engineer', 'site-engineer', 'Engineering', 'Karachi', 'Full-time',
   'We are looking for a skilled Site Engineer to oversee construction activities on-site. You will coordinate with subcontractors, ensure quality standards, and manage day-to-day operations.',
   'Bachelor''s degree in Civil Engineering. 2-4 years of construction site experience. Strong knowledge of construction methods and safety regulations. Excellent communication and leadership skills.',
   true, 1, NOW(), NOW()),
  ('Project Manager', 'project-manager', 'Management', 'Lahore', 'Full-time',
   'Join our team as a Project Manager to lead major construction projects from inception to completion. You will manage budgets, timelines, and client relationships while ensuring quality delivery.',
   'Bachelor''s or Master''s degree in Engineering or Construction Management. 5-8 years of project management experience. PMP certification preferred. Proven track record of delivering projects on time and within budget.',
   true, 2, NOW(), NOW()),
  ('HSE Officer', 'hse-officer', 'Health, Safety & Environment', 'Dubai', 'Full-time',
   'We are seeking a dedicated HSE Officer to implement and maintain health, safety, and environmental standards across our projects. You will conduct audits, training, and ensure regulatory compliance.',
   'Degree in Environmental Science, Occupational Health, or related field. 3+ years of HSE experience in construction. NEBOSH or equivalent certification. Strong knowledge of local and international safety regulations.',
   true, 3, NOW(), NOW());
