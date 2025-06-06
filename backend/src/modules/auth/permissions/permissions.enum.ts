// src/modules/auth/permissions/permission.enum.ts
export enum Permission {
  // User management
  CREATE_USER = 'create:user',
  READ_USER = 'read:user',
  UPDATE_USER = 'update:user',
  DELETE_USER = 'delete:user',

  // Animal management
  CREATE_ANIMAL = 'create:animal',
  READ_ANIMAL = 'read:animal',
  UPDATE_ANIMAL = 'update:animal',
  DELETE_ANIMAL = 'delete:animal',

  // Medical record management
  CREATE_MEDICAL_RECORD = 'create:medical_record',
  READ_MEDICAL_RECORD = 'read:medical_record',
  UPDATE_MEDICAL_RECORD = 'update:medical_record',
  DELETE_MEDICAL_RECORD = 'delete:medical_record',

  // Appointment management
  CREATE_APPOINTMENT = 'create:appointment',
  READ_APPOINTMENT = 'read:appointment',
  UPDATE_APPOINTMENT = 'update:appointment',
  DELETE_APPOINTMENT = 'delete:appointment',

  // Consultation management
  CREATE_CONSULTATION = 'create:consultation',
  READ_CONSULTATION = 'read:consultation',
  UPDATE_CONSULTATION = 'update:consultation',
  DELETE_CONSULTATION = 'delete:consultation',

  // Clinic management
  CREATE_CLINIC = 'create:clinic',
  READ_CLINIC = 'read:clinic',
  UPDATE_CLINIC = 'update:clinic',
  DELETE_CLINIC = 'delete:clinic',

  // Availability management
  CREATE_AVAILABILITY = 'create:availability',
  READ_AVAILABILITY = 'read:availability',
  UPDATE_AVAILABILITY = 'update:availability',
  DELETE_AVAILABILITY = 'delete:availability',

  // Payment management
  CREATE_PAYMENT = 'create:payment',
  READ_PAYMENT = 'read:payment',
  UPDATE_PAYMENT = 'update:payment',

  // Reports and statistics
  VIEW_STATISTICS = 'view:statistics',
  GENERATE_REPORTS = 'generate:reports',
}
