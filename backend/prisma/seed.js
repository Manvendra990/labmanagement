import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const categories = [
  'Haematology',
  'Biochemistry',
  'Serology & Immunology',
  'Clinical Pathology',
  'Cytology',
  'Microbiology',
  'Endocrinology',
  'Histopathology',
  'Others',
  'Miscellaneous',
];

try {
  for (const [index, name] of categories.entries()) {
    await db.testCategory.upsert({
      where: { name },
      update: { sortOrder: index + 1, active: true },
      create: { name, sortOrder: index + 1 },
    });
  }
} finally {
  await db.$disconnect();
}